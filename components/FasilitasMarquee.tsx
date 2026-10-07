import Marquee from "@/components/Marquee";
import type { ProfilFasilitasItem } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

export default function FasilitasMarquee({ items }: { items: ProfilFasilitasItem[] }) {
  return (
    <Marquee
      items={items}
      itemClassName="relative w-64 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_8px_20px_rgba(15,23,42,0.05)] md:w-72"
      renderItem={(item) => (
        <>
          <img
            src={sanityImageUrl(item.image, 640)}
            alt={item.name}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent px-4 pb-3 pt-10">
            <p className="font-heading text-base font-semibold text-white">{item.name}</p>
          </div>
        </>
      )}
    />
  );
}
