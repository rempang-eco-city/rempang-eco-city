import type { CSSProperties } from "react";
import Marquee from "@/components/Marquee";
import type { PariwisataPage, PokdarwisBidang } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

// Pokdarwis (Kelompok Sadar Wisata) sections shown above the destinations on
// /pariwisata: profile, organisation chart, and a marquee of pengurus.
export default function PokdarwisContent({ page }: { page: PariwisataPage }) {
  const hasStruktur =
    Boolean(page.ketua || page.sekretaris || page.bendahara || page.koordinatorBidang) ||
    page.bidang.length > 0;

  return (
    <div className="bg-white pt-12 md:pt-16">
      <div className="container-content">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0e8c8c]">
            Profil Pariwisata
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-primary-blue md:text-3xl">
            {page.groupName}
          </h2>

          {page.stats.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {page.stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="rounded-xl border border-slate-200 bg-bg-light p-4"
                >
                  <p className="text-xs text-text-secondary">{stat.label}</p>
                  <p className="mt-1 font-heading text-lg font-semibold text-text-primary md:text-xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {page.description.length > 0 && (
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary md:text-base">
              {page.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </section>

        {hasStruktur && (
          <section className="mt-14 border-t border-border-color pt-14">
            <h2 className="font-heading text-2xl font-bold text-primary-blue md:text-3xl">
              Struktur Organisasi {page.shortName}
            </h2>
            <div className="mt-8">
              <OrgChart page={page} />
            </div>
          </section>
        )}
      </div>

      {page.pengurus.length > 0 && (
        <section className="mt-14 pb-4">
          <div className="container-content">
            <div className="border-t border-border-color pt-14">
              <h2 className="font-heading text-2xl font-bold text-primary-blue md:text-3xl">
                Pengurus {page.shortName}
              </h2>
            </div>
          </div>
          {/* Full-width marquee, like the Fasilitas marquee on /profil. */}
          <div className="mt-8">
            <Marquee
              items={page.pengurus}
              minItemsPerSet={10}
              itemClassName="w-40 md:w-48"
              renderItem={(person) => (
                <>
                  <div className="aspect-[9/10] overflow-hidden rounded-2xl bg-slate-200">
                    {person.photo ? (
                      <img
                        src={sanityImageUrl(person.photo, 400)}
                        alt={person.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        Foto
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-center font-heading text-sm font-semibold text-primary-blue md:text-base">
                    {person.name}
                  </p>
                  <p className="mt-0.5 text-center text-xs text-text-secondary md:text-sm">
                    {person.role}
                  </p>
                </>
              )}
            />
          </div>
        </section>
      )}

      <div className="container-content">
        <div className="mt-14 border-t border-border-color" />
      </div>
    </div>
  );
}

// Gold org-chart palette from the Pokdarwis design.
const GOLD_BG = "bg-[#c0974a]";
const GOLD_BORDER = "border-[#c0974a]";

function VLine({ className = "h-10" }: { className?: string }) {
  return <span aria-hidden="true" className={`mx-auto block w-0.5 ${GOLD_BG} ${className}`} />;
}

function OrgCard({
  title,
  name,
  className = "",
  headerClassName = "",
}: {
  title: string;
  name: string;
  className?: string;
  headerClassName?: string;
}) {
  return (
    <div
      className={`relative z-10 w-full overflow-hidden rounded-xl border-2 ${GOLD_BORDER} bg-[#e3d7aa] text-center ${className}`}
    >
      <div
        className={`rounded-b-lg ${GOLD_BG} px-3 py-1.5 text-xs font-semibold uppercase leading-tight tracking-wide text-white sm:text-sm ${headerClassName}`}
      >
        {title}
      </div>
      <p className="px-3 py-2 font-heading text-base font-semibold text-slate-900 sm:text-lg">
        {name}
      </p>
    </div>
  );
}

function OrgChart({ page }: { page: PariwisataPage }) {
  const hasMiddleRow = Boolean(page.sekretaris || page.bendahara);

  return (
    <div className="flex flex-col items-center">
      {page.ketua && (
        <div className="w-full max-w-xs">
          <OrgCard title="Ketua" name={page.ketua} />
        </div>
      )}

      {hasMiddleRow ? (
        // The trunk runs from Ketua straight down to Koordinator Bidang; a bar
        // with rounded elbows branches off it to Sekretaris and Bendahara. The two
        // columns have no gap, so their centres sit exactly at 25% and 75%.
        <div className="relative w-full max-w-3xl pt-10 pb-12">
          <span aria-hidden="true" className={`absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 ${GOLD_BG}`} />
          <div aria-hidden="true" className={`mx-[25%] h-6 rounded-t-xl border-x-2 border-t-2 ${GOLD_BORDER}`} />
          <div className="grid grid-cols-2">
            <div className="flex justify-center px-2 sm:px-6">
              <OrgCard title="Sekretaris" name={page.sekretaris || "-"} />
            </div>
            <div className="flex justify-center px-2 sm:px-6">
              <OrgCard title="Bendahara" name={page.bendahara || "-"} />
            </div>
          </div>
        </div>
      ) : (
        page.ketua && page.koordinatorBidang && <VLine />
      )}

      {page.koordinatorBidang && (
        <div className="w-full max-w-xs">
          <OrgCard title="Koordinator Bidang" name={page.koordinatorBidang} />
        </div>
      )}

      {page.bidang.length > 0 && (
        <>
          <VLine className="h-8" />
          <BidangRow bidang={page.bidang} />
        </>
      )}
    </div>
  );
}

function BidangRow({ bidang }: { bidang: PokdarwisBidang[] }) {
  const count = bidang.length;

  return (
    <div className="relative w-full">
      {/* lg only: a bar from the first to the last column centre, with rounded
          elbows at both ends and straight drops for the columns in between. The
          columns have no gap (padding instead), so centres are at (i + 0.5) / n. */}
      {count > 1 && (
        <div
          aria-hidden="true"
          className={`absolute top-0 hidden h-6 rounded-t-xl border-x-2 border-t-2 lg:block ${GOLD_BORDER}`}
          style={{ left: `${50 / count}%`, right: `${50 / count}%` }}
        />
      )}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(var(--bidang-cols),minmax(0,1fr))] lg:gap-0"
        style={{ "--bidang-cols": count } as CSSProperties}
      >
        {bidang.map((item, index) => (
          <div key={`${item.name}-${index}`} className="relative lg:px-2 lg:pt-6">
            {(count === 1 || (index > 0 && index < count - 1)) && (
              <span aria-hidden="true" className={`absolute left-1/2 top-0 hidden h-6 w-0.5 -translate-x-1/2 lg:block ${GOLD_BG}`} />
            )}
            <OrgCard
              title={item.name}
              name={item.penanggungJawab}
              className="h-full"
              // Same header height whether the bidang name wraps to 1 or 2 lines.
              headerClassName="flex min-h-[3.25rem] items-center justify-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
