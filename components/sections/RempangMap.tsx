"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Anchor,
  ArrowLeft,
  Coffee,
  Cookie,
  ExternalLink,
  Fish,
  Hospital,
  MapPin,
  Mountain,
  Music,
  Navigation,
  School,
  ShoppingBag,
  ShoppingBasket,
  Store,
  UtensilsCrossed,
  Wrench,
  type LucideProps,
} from "lucide-react";
import type { PetaLokasi } from "@/lib/sanity/queries";
import { PETA_KATEGORI_OPTIONS, type PetaKategori } from "@/lib/peta";
import { sanityImageUrl } from "@/lib/sanity/image";
import { SLOPE_CLASSES, createSlopeLayer } from "./slopeLayer";

// Perumahan Relokasi Pulau Rempang, Tanjung Banon. Used as the starting
// view until the Studio has at least two locations.
const DEFAULT_CENTER: L.LatLngTuple = [0.8095, 104.2185];
const DEFAULT_ZOOM = 15;
const SELECTED_ZOOM = 17;

// Tile maps drawn by Leaflet, so our markers and the slope layer show on top.
// The Esri photos here predate the construction; OpenStreetMap already has
// the relocation housing streets.
const TILE_LAYERS = {
  esri: {
    label: "Satelit",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: {
      maxNativeZoom: 18,
      attribution: 'Citra: <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a>',
    },
  },
  osm: {
    label: "Peta",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      maxNativeZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    },
  },
} as const;

type TileLayerKey = keyof typeof TILE_LAYERS;

// "Google" shows Google Maps satellite in an iframe: its imagery already shows
// the new housing. Our markers and the slope layer cannot be drawn inside the
// iframe, so they are hidden in this mode.
type SatelliteView = { lat: number; lng: number; zoom: number };

function googleSatelliteUrl(view: SatelliteView, place: PetaLokasi | null) {
  // `q` drops a pin on the chosen place; `ll` only centres the map.
  const target = place ? `q=${place.lat},${place.lng}&z=18` : `ll=${view.lat},${view.lng}&z=${view.zoom}`;
  return `https://www.google.com/maps?${target}&t=k&output=embed`;
}

const KATEGORI_STYLE: Record<PetaKategori, { color: string; Icon: ComponentType<LucideProps> }> = {
  "warung-makan": { color: "#ea580c", Icon: UtensilsCrossed },
  "warung-jajan": { color: "#db2777", Icon: Cookie },
  kafe: { color: "#92400e", Icon: Coffee },
  pasar: { color: "#ca8a04", Icon: ShoppingBasket },
  "kebutuhan-pokok": { color: "#65a30d", Icon: ShoppingBag },
  masjid: { color: "#059669", Icon: MosqueIcon },
  sekolah: { color: "#7c3aed", Icon: School },
  kesehatan: { color: "#dc2626", Icon: Hospital },
  "sanggar-tari": { color: "#c026d3", Icon: Music },
  bengkel: { color: "#57534e", Icon: Wrench },
  koperasi: { color: "#0057A8", Icon: Store },
  "kampung-nelayan": { color: "#0d9488", Icon: Fish },
  dermaga: { color: "#0369a1", Icon: Anchor },
  lainnya: { color: "#64748b", Icon: MapPin },
};

const KATEGORI_LABEL = Object.fromEntries(
  PETA_KATEGORI_OPTIONS.map(({ value, title }) => [value, title])
) as Record<PetaKategori, string>;

type Filter = PetaKategori | "semua";

// Marker HTML is built once per category (and selected state) instead of per marker.
const markerIconCache = new Map<string, L.DivIcon>();

function markerIcon(kategori: PetaKategori, selected: boolean) {
  const cacheKey = `${kategori}-${selected}`;
  const cached = markerIconCache.get(cacheKey);
  if (cached) return cached;

  const { color, Icon } = KATEGORI_STYLE[kategori];
  const size = selected ? 44 : 34;
  const icon = L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, -size / 2],
    html: `<span class="flex h-full w-full items-center justify-center rounded-full border-2 border-white shadow-[0_2px_8px_rgba(15,23,42,0.45)] ${
      selected ? "ring-4 ring-white/70" : ""
    }" style="background:${color}">${renderToStaticMarkup(
      <Icon size={selected ? 20 : 16} strokeWidth={2.25} color="#ffffff" />
    )}</span>`,
  });
  markerIconCache.set(cacheKey, icon);
  return icon;
}

export default function RempangMap({ lokasi }: { lokasi: PetaLokasi[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const isFirstFilterRef = useRef(true);

  const [tileLayer, setTileLayer] = useState<TileLayerKey>("esri");
  // null = Leaflet map; set = Google satellite iframe at that view.
  const [satelliteView, setSatelliteView] = useState<SatelliteView | null>(null);
  const [showSlope, setShowSlope] = useState(false);
  const [filter, setFilter] = useState<Filter>("semua");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleLokasi = useMemo(
    () => (filter === "semua" ? lokasi : lokasi.filter((item) => item.category === filter)),
    [lokasi, filter]
  );
  const selected = visibleLokasi.find((item) => item._id === selectedId) ?? null;

  // Only categories that have at least one place get a filter chip.
  const kategoriCounts = useMemo(
    () =>
      PETA_KATEGORI_OPTIONS.map(({ value }) => ({
        value,
        count: lokasi.filter((item) => item.category === value).length,
      })).filter(({ count }) => count > 0),
    [lokasi]
  );

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 11,
      maxZoom: 19,
      // Wheel zoom only after the visitor clicks the map, so scrolling the
      // page past the map does not zoom it by accident.
      scrollWheelZoom: false,
    });
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());
    map.attributionControl.setPrefix(false);

    // With a single place, fitting would zoom onto it and hide the rest of
    // the area, so keep the default view until there are at least two.
    if (lokasi.length > 1) {
      map.fitBounds(L.latLngBounds(lokasi.map(({ lat, lng }) => [lat, lng])), {
        padding: [48, 48],
        maxZoom: 16,
      });
    }

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // The initial view only depends on the first data; later updates come
    // from the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const { url, options } = TILE_LAYERS[tileLayer];
    const layer = L.tileLayer(url, { ...options, maxZoom: 19 }).addTo(map);
    layer.bringToBack();
    return () => {
      layer.remove();
    };
  }, [tileLayer]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !showSlope) return;
    const layer = createSlopeLayer({ opacity: 0.7, maxZoom: 19, zIndex: 2 }).addTo(map);
    return () => {
      layer.remove();
    };
  }, [showSlope]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const group = L.layerGroup().addTo(map);
    visibleLokasi.forEach((item) => {
      const isSelected = item._id === selectedId;
      L.marker([item.lat, item.lng], {
        icon: markerIcon(item.category, isSelected),
        title: item.name,
        alt: item.name,
        riseOnHover: true,
        zIndexOffset: isSelected ? 1000 : 0,
      })
        .bindTooltip(item.name, { direction: "top" })
        .on("click", () => {
          setSelectedId(item._id);
          // Below lg the panel sits under the map; bring the details into view.
          if (window.matchMedia("(max-width: 1023px)").matches) {
            requestAnimationFrame(() =>
              detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
            );
          }
        })
        .addTo(group);
    });

    return () => {
      group.remove();
    };
  }, [visibleLokasi, selectedId]);

  // Zoom to the places of the chosen category (not on the first render, where
  // the map already starts on all places).
  useEffect(() => {
    if (isFirstFilterRef.current) {
      isFirstFilterRef.current = false;
      return;
    }
    const map = mapRef.current;
    if (!map || visibleLokasi.length === 0) return;
    map.flyToBounds(L.latLngBounds(visibleLokasi.map(({ lat, lng }) => [lat, lng])), {
      padding: [48, 48],
      maxZoom: SELECTED_ZOOM,
      duration: 0.8,
    });
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;
    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), SELECTED_ZOOM), {
      duration: 0.8,
    });
  }, [selected]);

  const showSatellite = () => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    setSatelliteView({ lat: center.lat, lng: center.lng, zoom: Math.round(map.getZoom()) });
  };

  const toggleSlope = () => {
    // The slope layer only exists on the Leaflet map, so leave Google for it.
    if (satelliteView) {
      setSatelliteView(null);
      setShowSlope(true);
    } else {
      setShowSlope((value) => !value);
    }
  };

  const slopeVisible = showSlope && !satelliteView;

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setSelectedId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:h-[560px] lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* `isolate` keeps Leaflet's high z-indexes from covering the fixed Navbar. */}
      <div className="relative isolate h-[420px] md:h-[480px] lg:h-full">
        <div ref={containerRef} className="h-full w-full bg-slate-200" aria-label="Peta interaktif Rempang Eco City" />

        {satelliteView && (
          // Above Leaflet's controls (z-index 1000), below our buttons.
          <iframe
            title="Citra satelit Rempang Eco City (Google Maps)"
            src={googleSatelliteUrl(satelliteView, selected)}
            className="absolute inset-0 z-[1001] h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        )}

        <div className="absolute right-3 top-3 z-[1002] flex flex-col items-end gap-2">
          <div className="flex rounded-lg bg-white p-1 shadow-md" role="group" aria-label="Jenis peta">
            {[
              ...(Object.keys(TILE_LAYERS) as TileLayerKey[]).map((key) => ({
                label: TILE_LAYERS[key].label,
                active: !satelliteView && tileLayer === key,
                onClick: () => {
                  setTileLayer(key);
                  setSatelliteView(null);
                },
              })),
              { label: "Google", active: Boolean(satelliteView), onClick: showSatellite },
            ].map(({ label, active, onClick }) => (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={onClick}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  active ? "bg-primary-blue text-white" : "text-slate-600 hover:text-primary-blue"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={slopeVisible}
            onClick={toggleSlope}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow-md transition ${
              slopeVisible ? "bg-primary-blue text-white" : "bg-white text-slate-700 hover:text-primary-blue"
            }`}
          >
            <Mountain size={14} />
            Tanjakan
          </button>
        </div>

        {slopeVisible && (
          <div className="absolute bottom-6 left-3 z-[1000] hidden w-48 rounded-lg bg-white/95 p-3 text-xs shadow-md lg:block">
            <SlopeLegend />
          </div>
        )}
      </div>

      {/* Below lg the legend would cover most of the map, so it sits under it. */}
      {slopeVisible && (
        <div className="border-t border-border-color bg-white p-4 text-xs lg:hidden">
          <SlopeLegend />
        </div>
      )}

      <aside
        ref={detailRef}
        className="flex min-h-0 flex-col border-t border-border-color bg-white lg:border-l lg:border-t-0"
      >
        {selected ? (
          <LokasiDetail lokasi={selected} onBack={() => setSelectedId(null)} />
        ) : (
          <>
            <div className="border-b border-border-color p-4">
              <p className="font-heading text-lg font-semibold text-text-primary">Tempat di Sekitar</p>
              {kategoriCounts.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <FilterChip active={filter === "semua"} onClick={() => changeFilter("semua")}>
                    Semua ({lokasi.length})
                  </FilterChip>
                  {kategoriCounts.map(({ value, count }) => (
                    <FilterChip
                      key={value}
                      active={filter === value}
                      color={KATEGORI_STYLE[value].color}
                      onClick={() => changeFilter(value)}
                    >
                      {KATEGORI_LABEL[value]} ({count})
                    </FilterChip>
                  ))}
                </div>
              )}
            </div>

            {lokasi.length === 0 ? (
              <p className="p-4 text-sm leading-relaxed text-text-secondary">
                Lokasi warung, masjid, koperasi, dan dermaga akan segera ditambahkan. Sementara itu,
                aktifkan <strong className="font-semibold text-text-primary">Tanjakan</strong> di
                pojok kanan atas peta untuk melihat kontur jalan.
              </p>
            ) : (
              <ul className="max-h-80 divide-y divide-border-color overflow-y-auto lg:max-h-none lg:flex-1">
                {visibleLokasi.map((item) => (
                  <li key={item._id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(item._id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <KategoriBadgeIcon kategori={item.category} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-text-primary">
                          {item.name}
                        </span>
                        <span className="block text-xs text-text-secondary">
                          {KATEGORI_LABEL[item.category]}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </aside>
    </div>
  );
}

function SlopeLegend() {
  return (
    <>
      <p className="font-semibold text-text-primary">Kemiringan lahan</p>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 lg:grid-cols-1">
        {SLOPE_CLASSES.map((slopeClass) => (
          <li key={slopeClass.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ background: `rgb(${slopeClass.rgb.join(",")})` }}
            />
            <span className="flex-1 text-text-primary">{slopeClass.name}</span>
            <span className="text-text-secondary">{slopeClass.label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 leading-snug text-text-secondary">
        Perkiraan dari data elevasi satelit, bukan hasil ukur jalan.
      </p>
    </>
  );
}

function LokasiDetail({ lokasi, onBack }: { lokasi: PetaLokasi; onBack: () => void }) {
  const { color } = KATEGORI_STYLE[lokasi.category];
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lokasi.lat},${lokasi.lng}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 self-start px-4 pt-4 text-sm font-medium text-primary-blue hover:underline"
      >
        <ArrowLeft size={16} />
        Semua tempat
      </button>

      <div className="p-4">
        {lokasi.photo && (
          <img
            src={sanityImageUrl(lokasi.photo, 700)}
            alt={lokasi.name}
            className="mb-4 aspect-[16/10] w-full rounded-xl object-cover"
          />
        )}
        <span
          className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold text-white"
          style={{ background: color }}
        >
          {KATEGORI_LABEL[lokasi.category]}
        </span>
        <h3 className="mt-2 font-heading text-xl font-semibold text-text-primary">{lokasi.name}</h3>
        {lokasi.description && (
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{lokasi.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
          >
            <Navigation size={15} />
            Petunjuk Arah
          </a>
          {lokasi.link && (
            <a
              href={lokasi.link}
              {...(lokasi.link.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-primary-blue hover:text-primary-blue"
            >
              <ExternalLink size={15} />
              Lihat Detail
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-primary-blue bg-primary-blue text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      }`}
    >
      {color && (
        <span
          className="h-2 w-2 rounded-full ring-1 ring-white"
          style={{ background: color }}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

function KategoriBadgeIcon({ kategori }: { kategori: PetaKategori }) {
  const { color, Icon } = KATEGORI_STYLE[kategori];
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      style={{ background: color }}
      aria-hidden="true"
    >
      <Icon size={16} strokeWidth={2.25} color="#ffffff" />
    </span>
  );
}

// lucide-react has no mosque icon; drawn in the same 24×24 stroke style.
function MosqueIcon({ size = 24, strokeWidth = 2, color = "currentColor", ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13 2.5v1.5" />
      <path d="M8.5 11c0-2.6 1.9-4.4 4.5-6 2.6 1.6 4.5 3.4 4.5 6" />
      <path d="M7 21V11h12v10" />
      <path d="M11 21v-3a2 2 0 0 1 4 0v3" />
      <path d="M3 21V9.5l1-2 1 2V21" />
      <path d="M2 21h20" />
    </svg>
  );
}
