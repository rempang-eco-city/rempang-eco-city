import type { ReactNode } from "react";
import Marquee from "@/components/Marquee";
import type { PariwisataPage, PokdarwisBidang } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

// Pokdarwis (Kelompok Sadar Wisata) sections shown above the destinations on
// /pariwisata: profile, organisation chart, and a marquee of pengurus.
export default function PokdarwisContent({ page }: { page: PariwisataPage }) {
  const hasStruktur =
    page.penasehat.length > 0 ||
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

const CONNECTOR = "bg-slate-400";

function VLine({ className = "h-8" }: { className?: string }) {
  return <span aria-hidden="true" className={`mx-auto block w-px ${CONNECTOR} ${className}`} />;
}

function OrgCard({
  title,
  children,
  className = "",
  headerClassName = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-slate-200 bg-white text-center shadow-[0_4px_12px_rgba(15,23,42,0.06)] ${className}`}
    >
      <div
        className={`bg-gradient-to-r from-[#0e8c8c] to-[#0b6577] px-3 py-2 text-[11px] font-bold uppercase leading-tight tracking-wide text-white ${headerClassName}`}
      >
        {title}
      </div>
      <div className="px-3 py-2.5 text-sm text-text-primary">{children}</div>
    </div>
  );
}

function OrgChart({ page }: { page: PariwisataPage }) {
  const hasMiddleRow = Boolean(page.sekretaris || page.bendahara);

  return (
    <div className="flex flex-col items-center">
      {page.penasehat.length > 0 && (
        <>
          <OrgCard title="Penasehat" className="w-56">
            {page.penasehat.map((name) => (
              <p key={name}>{name}</p>
            ))}
          </OrgCard>
          <VLine />
        </>
      )}

      {page.ketua && <OrgCard title="Ketua" className="w-56">{page.ketua}</OrgCard>}

      {hasMiddleRow && (
        // Sekretaris and Bendahara hang off the trunk with a horizontal line.
        // The row is symmetric, so the two line segments meet at the trunk.
        <div className="relative flex w-full items-center justify-center py-6">
          <span aria-hidden="true" className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 ${CONNECTOR}`} />
          <OrgCard title="Sekretaris" className="relative z-10 w-36 sm:w-52">
            {page.sekretaris || "-"}
          </OrgCard>
          <span aria-hidden="true" className={`h-px w-6 sm:w-16 lg:w-28 ${CONNECTOR}`} />
          <span aria-hidden="true" className={`h-px w-6 sm:w-16 lg:w-28 ${CONNECTOR}`} />
          <OrgCard title="Bendahara" className="relative z-10 w-36 sm:w-52">
            {page.bendahara || "-"}
          </OrgCard>
        </div>
      )}

      {!hasMiddleRow && page.ketua && page.koordinatorBidang && <VLine />}

      {page.koordinatorBidang && (
        <OrgCard title="Koordinator Bidang" className="w-56">
          {page.koordinatorBidang}
        </OrgCard>
      )}

      {page.bidang.length > 0 && (
        <>
          <VLine className="h-6" />
          <BidangRow bidang={page.bidang} />
        </>
      )}
    </div>
  );
}

function BidangRow({ bidang }: { bidang: PokdarwisBidang[] }) {
  const last = bidang.length - 1;

  return (
    // On lg the columns have no gap (padding instead), so each column's slice of
    // the horizontal bar touches its neighbour's and they read as one line.
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
      {bidang.map((item, index) => {
        const barSpan =
          index === 0 && index === last
            ? "hidden"
            : index === 0
              ? "left-1/2 right-0"
              : index === last
                ? "left-0 right-1/2"
                : "inset-x-0";

        return (
          <div key={`${item.name}-${index}`} className="relative lg:px-2 lg:pt-6">
            <span aria-hidden="true" className={`absolute top-0 hidden h-px lg:block ${barSpan} ${CONNECTOR}`} />
            <span aria-hidden="true" className={`absolute left-1/2 top-0 hidden h-6 w-px -translate-x-1/2 lg:block ${CONNECTOR}`} />

            <OrgCard
              title={`Bidang ${item.name}`}
              className="h-full"
              // Same header height whether the bidang name wraps to 1 or 2 lines.
              headerClassName="flex min-h-[2.75rem] items-center justify-center"
            >
              <p className="text-[11px] text-text-secondary">Penanggung Jawab</p>
              <p className="font-semibold">{item.penanggungJawab}</p>
              {item.anggota.length > 0 && (
                <>
                  <div className="my-2 border-t border-slate-200" />
                  <p className="text-[11px] text-text-secondary">Anggota</p>
                  {item.anggota.map((name, i) => (
                    <p key={`${name}-${i}`}>{name}</p>
                  ))}
                </>
              )}
            </OrgCard>
          </div>
        );
      })}
    </div>
  );
}
