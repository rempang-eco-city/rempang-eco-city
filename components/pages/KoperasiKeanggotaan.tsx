import { ArrowRight, CalendarDays, ClipboardList, Gift, Info, Users } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import type { KoperasiDetail } from "@/lib/sanity/queries";

// Same palette as each cooperative's organisation chart (StrukturOrganisasi).
const THEMES = {
  transmigrasi: {
    banner: "from-[#132a3e] via-[#1f3f5a] to-[#2d5a80]",
    shadow: "shadow-[0_24px_48px_rgba(31,63,90,0.3)]",
    pill: "bg-primary-yellow text-[#1f3f5a]",
    accent: "text-[#1f3f5a]",
    accentSoft: "bg-[#1f3f5a]/10",
  },
  "merah-putih": {
    banner: "from-[#9f2329] via-[#d43f46] to-[#e8676d]",
    shadow: "shadow-[0_24px_48px_rgba(212,63,70,0.3)]",
    pill: "bg-white text-[#d43f46]",
    accent: "text-[#d43f46]",
    accentSoft: "bg-[#d43f46]/10",
  },
} as const;

const LABEL_ICONS: Record<string, typeof Info> = {
  syarat: ClipboardList,
  persyaratan: ClipboardList,
  manfaat: Gift,
  keuntungan: Gift,
};

type Paragraph = { label?: string; text: string };

/**
 * Splits the description into paragraphs; one starting with a short label
 * ("Syarat: …", "Manfaat: …") becomes its own card beside the intro.
 */
function toParagraphs(description = ""): Paragraph[] {
  return description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      const match = paragraph.match(/^([A-Za-zÀ-ÿ ]{3,24}):\s*([\s\S]+)$/);
      if (!match) return { text: paragraph };
      // "Syarat: warga …" reads as a sentence once it has its own card.
      const text = match[2].trim();
      return { label: match[1].trim(), text: text.charAt(0).toUpperCase() + text.slice(1) };
    });
}

/** Call to action to join the cooperative, themed per cooperative. */
export default function KoperasiKeanggotaan({ koperasi }: { koperasi: KoperasiDetail }) {
  const { name, membershipWhatsapp, membershipDescription, memberCount, yearFounded } = koperasi;
  if (!membershipWhatsapp) return null;

  const theme = THEMES[koperasi.routeKey === "merah-putih" ? "merah-putih" : "transmigrasi"];
  const paragraphs = toParagraphs(membershipDescription);
  const intro = paragraphs.filter((p) => !p.label);
  const cards = paragraphs.filter((p) => p.label);
  // Plain wa.me links get a prefilled message; other links are used as they are.
  const href = /^https:\/\/wa\.me\/\d+$/.test(membershipWhatsapp)
    ? `${membershipWhatsapp}?text=${encodeURIComponent(`Halo ${name}, saya tertarik menjadi anggota koperasi.`)}`
    : membershipWhatsapp;

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-content">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br px-6 py-10 text-white md:px-12 md:py-14 ${theme.banner} ${theme.shadow}`}
        >
          {/* Decorative shapes */}
          <span className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[32px] border-white/[0.06]" />
          <span className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <Users
            className="pointer-events-none absolute -bottom-8 right-4 h-44 w-44 text-white/[0.06] md:h-60 md:w-60"
            aria-hidden="true"
          />

          <div
            className={`relative grid items-center gap-8 ${
              cards.length > 0 ? "lg:grid-cols-[1.1fr_1fr]" : "text-center"
            }`}
          >
            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${theme.pill}`}
              >
                <Users size={14} aria-hidden="true" />
                Keanggotaan
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight md:text-4xl">
                Jadi Anggota {name}
              </h2>
              {intro.map((paragraph, index) => (
                <p
                  key={index}
                  className={`mt-4 whitespace-pre-line leading-relaxed text-white/85 ${
                    cards.length > 0 ? "" : "mx-auto max-w-3xl"
                  }`}
                >
                  {paragraph.text}
                </p>
              ))}

              <div className={`mt-6 flex flex-wrap gap-3 ${cards.length > 0 ? "" : "justify-center"}`}>
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                  <Users size={16} aria-hidden="true" />
                  <span>
                    <strong className="font-bold">{memberCount}</strong> anggota
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                  <CalendarDays size={16} aria-hidden="true" />
                  <span>
                    Berdiri <strong className="font-bold">{yearFounded}</strong>
                  </span>
                </span>
              </div>

              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-50 ${theme.accent}`}
              >
                <WhatsAppIcon className="h-5 w-5 text-[#2bb673]" />
                Daftar via WhatsApp
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>

            {cards.length > 0 && (
              <div className="space-y-4">
                {cards.map((card, index) => {
                  const Icon = LABEL_ICONS[card.label!.toLowerCase()] ?? Info;
                  return (
                    <div
                      key={`${card.label}-${index}`}
                      className="rounded-2xl bg-white p-5 text-text-primary shadow-[0_18px_36px_rgba(0,0,0,0.15)] md:p-6"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.accentSoft} ${theme.accent}`}
                        >
                          <Icon size={20} aria-hidden="true" />
                        </span>
                        <p className="font-heading text-lg font-bold">{card.label}</p>
                      </div>
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                        {card.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
