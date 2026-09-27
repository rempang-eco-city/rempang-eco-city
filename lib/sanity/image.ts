// Sanity serves originals by default (UMKM photos are often 2–3 MB). Its image
// CDN resizes on the fly via URL params, so ask for a width that fits the slot.
// `fit=max` never upscales; `auto=format` serves WebP/AVIF when supported.
export function sanityImageUrl(url: string, width: number) {
  if (!url.startsWith("https://cdn.sanity.io/")) return url;

  const params = new URLSearchParams({
    w: String(width),
    fit: "max",
    auto: "format",
  });
  return `${url}${url.includes("?") ? "&" : "?"}${params}`;
}
