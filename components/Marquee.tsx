import type { ReactNode } from "react";

type Props<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  /** Classes for each card's <li> (width, borders, …). */
  itemClassName: string;
  /** Short lists are repeated until one set has at least this many cards. */
  minItemsPerSet?: number;
  secondsPerItem?: number;
};

// Infinite horizontal marquee: pauses on hover, fades at the edges, and becomes
// a plain scrollable row (single copy) when the user prefers reduced motion.
export default function Marquee<T>({
  items,
  renderItem,
  itemClassName,
  minItemsPerSet = 8,
  secondsPerItem = 5,
}: Props<T>) {
  // One set must be wider than the screen, or a gap shows before the loop restarts.
  const repeats = Math.ceil(minItemsPerSet / items.length);
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
          className={`shrink-0 ${itemClassName}`}
        >
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto">
      {/* The track holds two identical sets; the `marquee` keyframe shifts it by
          half its width, which lands exactly where it started. */}
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${set.length * secondsPerItem}s` }}
      >
        {renderSet(0)}
        {renderSet(1)}
      </div>
    </div>
  );
}
