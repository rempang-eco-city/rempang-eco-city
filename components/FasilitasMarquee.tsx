import type { ProfilFasilitasItem } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

// One set must be wider than the screen, or a gap shows before the loop
// restarts; short lists are repeated until a set has at least this many cards.
const MIN_CARDS_PER_SET = 8;
const SECONDS_PER_CARD = 5;

export default function FasilitasMarquee({ items }: { items: ProfilFasilitasItem[] }) {
  const repeats = Math.ceil(MIN_CARDS_PER_SET / items.length);
  const set = Array.from({ length: repeats }, () => items).flat();

  const renderSet = (copy: number) => (
    <ul
      // Only the first copy is announced to screen readers; it alone is shown
      // when reduced motion turns the marquee into a scrollable row.
      aria-hidden={copy > 0 || undefined}
      className={`flex shrink-0 gap-5 pr-5 ${copy > 0 ? "motion-reduce:hidden" : ""}`}
    >
      {set.map((item, index) => (
        <li
          key={`${copy}-${index}`}
          // Repeats of the same item inside the first copy are visual filler too.
          aria-hidden={copy === 0 && index >= items.length ? true : undefined}
          className="relative w-64 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_8px_20px_rgba(15,23,42,0.05)] md:w-72"
        >
          <img
            src={sanityImageUrl(item.image, 640)}
            alt={item.name}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent px-4 pb-3 pt-10">
            <p className="font-heading text-base font-semibold text-white">{item.name}</p>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto"
    >
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${set.length * SECONDS_PER_CARD}s` }}
      >
        {renderSet(0)}
        {renderSet(1)}
      </div>
    </div>
  );
}
