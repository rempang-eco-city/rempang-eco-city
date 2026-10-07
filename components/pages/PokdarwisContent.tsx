import type { PariwisataPage } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

// Pokdarwis (Kelompok Sadar Wisata) sections shown above the destinations on
// /pariwisata: profile, organisation chart image, and pengurus cards.
export default function PokdarwisContent({
  page,
}: {
  page: PariwisataPage & { groupName: string; shortName: string };
}) {
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

        {page.structureImage && (
          <section className="mt-14 border-t border-border-color pt-14">
            <h2 className="font-heading text-2xl font-bold text-primary-blue md:text-3xl">
              Struktur Organisasi {page.shortName}
            </h2>
            {/* Same framed image as the Struktur Kepengurusan on /koperasi/[routeKey]. */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.03)] md:p-6">
              <img
                src={sanityImageUrl(page.structureImage, 2000)}
                alt={`Struktur organisasi ${page.shortName}`}
                className="mx-auto w-full max-w-6xl object-contain"
              />
            </div>
          </section>
        )}

        {page.pengurus.length > 0 && (
          <section className="mt-14 border-t border-border-color pt-14">
            <h2 className="font-heading text-2xl font-bold text-primary-blue md:text-3xl">
              Pengurus {page.shortName}
            </h2>
            {/* Same cards as the Pengurus on /koperasi/[routeKey]. */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {page.pengurus.map((person, index) => (
                <article
                  key={`${person.name}-${index}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
                >
                  <div className="overflow-hidden bg-[#39b7c9]">
                    {person.photo ? (
                      <img
                        src={sanityImageUrl(person.photo, 600)}
                        alt={person.name}
                        loading="lazy"
                        className="h-72 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-72 w-full items-center justify-center text-sm text-white/80">
                        Foto
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-semibold text-primary-blue">{person.name}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{person.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 border-t border-border-color" />
      </div>
    </div>
  );
}
