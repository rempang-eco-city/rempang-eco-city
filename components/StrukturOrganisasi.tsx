import type { CSSProperties, ReactNode } from "react";
import type { StrukturJabatan, StrukturOrganisasi as Struktur } from "@/lib/sanity/queries";

// Colours taken from the chart images the pages used before.
const THEMES = {
  biru: { header: "#1f3f5a", body: "#b1bfca" },
  merah: { header: "#d43f46", body: "#f4d4d5" },
  emas: { header: "#bf9547", body: "#e4d7aa" },
} as const;

export type StrukturTheme = keyof typeof THEMES;

/**
 * Organisation chart drawn from CMS data. Desktop: the tree with connector
 * lines, like the old images. Below md: the same boxes stacked vertically.
 */
export default function StrukturOrganisasi({
  struktur,
  theme,
}: {
  struktur: Struktur;
  theme: StrukturTheme;
}) {
  const style = {
    "--s-header": THEMES[theme].header,
    "--s-body": THEMES[theme].body,
  } as CSSProperties;

  return (
    <div style={style}>
      <div className="hidden md:block">
        <TreeLayout struktur={struktur} />
      </div>
      <div className="md:hidden">
        <StackedLayout struktur={struktur} />
      </div>
    </div>
  );
}

function TreeLayout({ struktur }: { struktur: Struktur }) {
  const { ketua, pengawas, pengurusInti, koordinator, bidang } = struktur;

  // The centre line ("trunk") runs from Ketua down to the last row that hangs
  // off it, so each row needs to know whether anything comes after it.
  const rows = [
    pengawas && "pengawas",
    pengurusInti.length > 0 && "inti",
    koordinator && "koordinator",
    bidang.length > 0 && "bidang",
  ].filter(Boolean) as string[];
  const continues = (row: string) => rows.indexOf(row) < rows.length - 1;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative flex justify-center">
        {rows.length > 0 && <Trunk className="top-1/2 bottom-0" />}
        <JabatanBox jabatan={ketua} className="w-full max-w-xs" />
      </div>

      {pengawas && (
        <div className="relative grid grid-cols-2 pt-8">
          <Trunk className={continues("pengawas") ? "top-0 bottom-0" : "top-0 h-1/2"} />
          <div className="col-start-2 flex items-center">
            <span className="h-0.5 w-12 shrink-0 bg-[var(--s-header)] lg:w-20" />
            <JabatanBox jabatan={pengawas} className="w-full max-w-xs" />
          </div>
        </div>
      )}

      {pengurusInti.length > 0 && (
        <BracketRow items={pengurusInti} continues={continues("inti")} />
      )}

      {koordinator && (
        <div className="relative flex justify-center pt-10">
          <Trunk className={continues("koordinator") ? "top-0 bottom-0" : "top-0 h-1/2"} />
          <JabatanBox jabatan={koordinator} className="w-full max-w-xs" />
        </div>
      )}

      {bidang.length > 0 && <BracketRow items={bidang} continues={false} />}
    </div>
  );
}

/** A row of boxes joined by a horizontal bar that hangs off the trunk. */
function BracketRow({ items, continues }: { items: StrukturJabatan[]; continues: boolean }) {
  const count = items.length;

  return (
    <div className="relative pt-10">
      {/* Trunk down to the bar, or past it when more rows follow. */}
      <Trunk className={continues ? "top-0 bottom-0" : "top-0 h-10"} />
      <div className="grid" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {items.map((jabatan, index) => {
          const first = index === 0;
          const last = index === count - 1;
          return (
            <div key={`${jabatan.title}-${index}`} className="relative flex flex-col pt-6">
              {count > 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-0 h-6 border-t-2 border-[var(--s-header)] ${
                    first
                      ? "left-1/2 right-0 rounded-tl-lg border-l-2"
                      : last
                        ? "left-0 right-1/2 rounded-tr-lg border-r-2"
                        : "left-0 right-0"
                  }`}
                />
              )}
              {(count === 1 || (!first && !last)) && (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 h-6 w-0.5 -translate-x-1/2 bg-[var(--s-header)]"
                />
              )}
              <div className={`flex flex-1 justify-center ${count > 3 ? "px-2" : "px-4 lg:px-8"}`}>
                {/* With 3+ narrow boxes some titles wrap to two lines; give every
                    header that height so the names below line up. */}
                <JabatanBox jabatan={jabatan} className="w-full max-w-xs" tallHeader={count > 2} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Trunk({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-1/2 w-0.5 -translate-x-1/2 bg-[var(--s-header)] ${className}`}
    />
  );
}

function StackedLayout({ struktur }: { struktur: Struktur }) {
  const { ketua, pengawas, pengurusInti, koordinator, bidang } = struktur;
  const groups: ReactNode[] = [
    <JabatanBox key="ketua" jabatan={ketua} className="mx-auto w-full max-w-xs" />,
    pengawas && <JabatanBox key="pengawas" jabatan={pengawas} className="mx-auto w-full max-w-xs" />,
    pengurusInti.length > 0 && <BoxGrid key="inti" items={pengurusInti} />,
    koordinator && (
      <JabatanBox key="koordinator" jabatan={koordinator} className="mx-auto w-full max-w-xs" />
    ),
    bidang.length > 0 && <BoxGrid key="bidang" items={bidang} />,
  ].filter(Boolean);

  return (
    <div className="flex flex-col">
      {groups.map((group, index) => (
        <div key={index} className="flex flex-col">
          {index > 0 && (
            <span aria-hidden="true" className="mx-auto h-6 w-0.5 bg-[var(--s-header)]" />
          )}
          {group}
        </div>
      ))}
    </div>
  );
}

function BoxGrid({ items }: { items: StrukturJabatan[] }) {
  return (
    <div className={`grid gap-3 ${items.length > 1 ? "grid-cols-1 min-[420px]:grid-cols-2" : ""}`}>
      {items.map((jabatan, index) => (
        <JabatanBox key={`${jabatan.title}-${index}`} jabatan={jabatan} />
      ))}
    </div>
  );
}

function JabatanBox({
  jabatan,
  className = "",
  tallHeader = false,
}: {
  jabatan: StrukturJabatan;
  className?: string;
  tallHeader?: boolean;
}) {
  const { title, members } = jabatan;
  const hasRoles = members.some((member) => member.role);

  return (
    <div
      className={`relative z-10 flex flex-col overflow-hidden rounded-xl border-2 border-[var(--s-header)] bg-[var(--s-body)] ${className}`}
    >
      <p
        className={`flex items-center justify-center rounded-b-lg bg-[var(--s-header)] px-3 py-1.5 text-center font-heading text-xs font-semibold uppercase leading-snug tracking-wide text-white lg:text-sm ${
          tallHeader ? "min-h-[2.875rem] lg:min-h-[3.25rem]" : ""
        }`}
      >
        {title}
      </p>
      <div className="flex flex-1 items-center justify-center px-4 py-3">
        {hasRoles ? (
          <dl className="grid w-full grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
            {members.map((member, index) => (
              <div key={`${member.name}-${index}`} className="contents">
                <dt className="justify-self-start rounded-md bg-[var(--s-header)] px-2.5 py-0.5 text-xs font-semibold text-white lg:text-sm">
                  {member.role}
                </dt>
                <dd className="text-center font-heading text-sm font-semibold text-slate-900 lg:text-base">
                  {member.name}
                </dd>
              </div>
            ))}
          </dl>
        ) : members.length > 1 ? (
          <ul className="list-disc space-y-1 pl-5 text-left font-heading text-sm font-semibold text-slate-900 marker:text-slate-900 lg:text-base">
            {members.map((member, index) => (
              <li key={`${member.name}-${index}`}>{member.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-center font-heading text-base font-semibold text-slate-900 lg:text-lg">
            {members[0].name}
          </p>
        )}
      </div>
    </div>
  );
}
