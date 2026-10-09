import type { PortableTextBlock as RichTextBlock } from "@portabletext/react";
import { sanityClient } from "./client";
import type { LayananIconKey } from "@/lib/layananIcons";
import { parseKoordinat, type PetaKategori } from "@/lib/peta";

const REVALIDATE_SECONDS = 60;

async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = []
): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: { revalidate: REVALIDATE_SECONDS, tags },
  });
}

type PortableTextBlock = { children?: Array<{ text?: string }> };

function blocksToParagraphs(blocks: PortableTextBlock[] | null | undefined) {
  return (
    blocks?.map(
      (block) => block.children?.map((span) => span.text ?? "").join("") ?? ""
    ) ?? []
  );
}

const newsDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// `publishedAt` is a real date (used for sorting); older documents only have
// the free-text `date`, so fall back to it when publishedAt is missing.
function formatNewsDate(publishedAt: string | null, legacyDate: string | null) {
  if (publishedAt) return newsDateFormatter.format(new Date(publishedAt));
  return legacyDate ?? "";
}

export type NewsCategory =
  | "Development"
  | "Community"
  | "Investment"
  | "Sustainability"
  | "Events";

export type NewsArticleListItem = {
  _id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  date: string;
  excerpt: string;
  image: string;
  featured: boolean;
};

export type NewsArticleDetail = NewsArticleListItem & {
  // Kept as Portable Text so bold, links, headings and lists survive; render
  // with <PortableText> (see components/RichText.tsx).
  content: RichTextBlock[];
};

type RawNewsArticle = Omit<NewsArticleListItem, "date"> & {
  publishedAt: string | null;
  date: string | null;
};

const newsListFields = `
  _id,
  title,
  "slug": slug.current,
  category,
  publishedAt,
  date,
  excerpt,
  "image": image.asset->url,
  featured
`;

function toNewsListItem({
  publishedAt,
  date,
  ...article
}: RawNewsArticle): NewsArticleListItem {
  return { ...article, date: formatNewsDate(publishedAt, date) };
}

const newsOrder = `order(coalesce(publishedAt, _createdAt) desc)`;

export async function getNewsArticles() {
  const articles = await sanityFetch<RawNewsArticle[]>(
    `*[_type == "newsArticle"] | ${newsOrder} {${newsListFields}}`,
    {},
    ["newsArticle"]
  );

  return articles.map(toNewsListItem);
}

export async function getLatestNewsArticles(limit: number) {
  const articles = await sanityFetch<RawNewsArticle[]>(
    `*[_type == "newsArticle"] | ${newsOrder} [0...$limit] {${newsListFields}}`,
    { limit },
    ["newsArticle"]
  );

  return articles.map(toNewsListItem);
}

export async function getNewsArticleBySlug(slug: string) {
  const article = await sanityFetch<
    (RawNewsArticle & { content: RichTextBlock[] | null }) | null
  >(
    `*[_type == "newsArticle" && slug.current == $slug][0]{${newsListFields}, content}`,
    { slug },
    ["newsArticle"]
  );

  if (!article) return null;

  const { content, ...rest } = article;
  return {
    ...toNewsListItem(rest),
    content: content ?? [],
  } satisfies NewsArticleDetail;
}

export type UmkmCategory = "Kuliner" | "Kerajinan" | "Jasa";

export type UmkmProduct = {
  name: string;
  price: string;
  image: string;
};

export type UmkmListItem = {
  _id: string;
  name: string;
  slug: string;
  category: UmkmCategory;
  image: string;
  cardDescription: string;
};

export type UmkmDetail = UmkmListItem & {
  description: string;
  location?: string;
  owner?: string;
  whatsapp: string;
  shopee?: string;
  gallery: string[];
  products: UmkmProduct[];
};

const umkmListProjection = `{
  _id,
  name,
  "slug": slug.current,
  category,
  "image": image.asset->url,
  cardDescription
}`;

export async function getUmkmItems() {
  return sanityFetch<UmkmListItem[]>(
    `*[_type == "umkmItem"] | order(_createdAt asc) ${umkmListProjection}`,
    {},
    ["umkmItem"]
  );
}

export async function getUmkmSlugs() {
  return sanityFetch<{ slug: string }[]>(
    `*[_type == "umkmItem"]{ "slug": slug.current }`,
    {},
    ["umkmItem"]
  );
}

export async function getUmkmItemBySlug(slug: string) {
  return sanityFetch<UmkmDetail | null>(
    `*[_type == "umkmItem" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      category,
      "image": image.asset->url,
      cardDescription,
      description,
      location,
      owner,
      whatsapp,
      shopee,
      "gallery": gallery[].asset->url,
      products[]{ name, price, "image": image.asset->url }
    }`,
    { slug },
    ["umkmItem"]
  );
}

export type KoperasiRouteKey = "transmigrasi" | "merah-putih";

export type KoperasiListItem = {
  _id: string;
  name: string;
  routeKey: KoperasiRouteKey;
  homeCardDescription: string;
  heroImage: string;
  yearFounded: string;
  memberCount: string;
};

export type KoperasiPengurus = {
  name: string;
  role: string;
  image: string;
};

export type KoperasiGalleryItem = {
  title: string;
  description: string;
  images: string[];
};

export type KoperasiFasilitas = {
  name: string;
  description?: string;
  image: string;
};

export type KoperasiLayanan = {
  title: string;
  icon: LayananIconKey;
  description: string;
  highlights: string[];
};

export type KoperasiLaporanKeuangan = {
  title: string;
  cover: string;
  fileUrl: string;
  /** Lowercase file extension without the dot, e.g. "pdf", "xlsx", "docx". */
  fileExtension: string;
};

export type KoperasiDetail = KoperasiListItem & {
  pageDescription?: string;
  about: string[];
  structureImage: string;
  pengurus: KoperasiPengurus[];
  membershipDescription?: string;
  membershipWhatsapp?: string;
  fasilitas: KoperasiFasilitas[];
  layanan: KoperasiLayanan[];
  galleryItems: KoperasiGalleryItem[];
  laporanKeuangan: KoperasiLaporanKeuangan[];
};

const koperasiListFields = `
  _id,
  name,
  routeKey,
  homeCardDescription,
  "heroImage": heroImage.asset->url,
  yearFounded,
  memberCount
`;

export async function getKoperasiList() {
  return sanityFetch<KoperasiListItem[]>(
    `*[_type == "koperasi"] | order(_createdAt asc) {${koperasiListFields}}`,
    {},
    ["koperasi"]
  );
}

export async function getKoperasiByRouteKey(routeKey: string) {
  const koperasi = await sanityFetch<
    | (Omit<
        KoperasiDetail,
        "about" | "pengurus" | "fasilitas" | "layanan" | "galleryItems" | "laporanKeuangan"
      > & {
        about: PortableTextBlock[] | null;
        pengurus: KoperasiPengurus[] | null;
        fasilitas: Array<Partial<KoperasiFasilitas>> | null;
        layanan: Array<Partial<KoperasiLayanan>> | null;
        galleryItems: KoperasiGalleryItem[] | null;
        laporanKeuangan: Array<Partial<KoperasiLaporanKeuangan>> | null;
      })
    | null
  >(
    `*[_type == "koperasi" && routeKey == $routeKey][0]{
      ${koperasiListFields},
      pageDescription,
      about,
      "structureImage": structureImage.asset->url,
      pengurus[]{ name, role, "image": image.asset->url },
      membershipDescription,
      membershipWhatsapp,
      fasilitas[]{ name, description, "image": image.asset->url },
      layanan[]{ title, icon, description, "highlights": coalesce(highlights, []) },
      galleryItems[]{ title, description, "images": images[].asset->url },
      laporanKeuangan[]{
        title,
        "cover": cover.asset->url,
        "fileUrl": file.asset->url,
        "fileExtension": lower(file.asset->extension)
      }
    }`,
    { routeKey },
    ["koperasi"]
  );

  if (!koperasi) return null;

  return {
    ...koperasi,
    about: blocksToParagraphs(koperasi.about),
    pengurus: koperasi.pengurus ?? [],
    // Drafts in the Studio can have missing required fields; skip those.
    fasilitas: (koperasi.fasilitas ?? []).filter(
      (item): item is KoperasiFasilitas =>
        Boolean(item.name && item.image)
    ),
    layanan: (koperasi.layanan ?? []).filter(
      (item): item is KoperasiLayanan =>
        Boolean(item.title && item.icon && item.description)
    ),
    galleryItems: (koperasi.galleryItems ?? []).filter(
      (item) => item.images?.length > 0
    ),
    // Drafts in the Studio can have a missing cover or file; skip those.
    laporanKeuangan: (koperasi.laporanKeuangan ?? []).filter(
      (item): item is KoperasiLaporanKeuangan =>
        Boolean(item.title && item.cover && item.fileUrl && item.fileExtension)
    ),
  } satisfies KoperasiDetail;
}

export type PariwisataRouteKey = "mancing" | "mangrove" | "pulau";

export type PariwisataMedia = {
  type: "image" | "video";
  url: string;
};

export type PariwisataPaketItem = {
  name: string;
  price: number;
  unit: "orang" | "jam" | "paket";
  note?: string;
};

export type PariwisataPaket = {
  label: string;
  title: string;
  participants: number;
  durationHours?: number;
  items: PariwisataPaketItem[];
  total: number;
};

export type PariwisataDestination = {
  _id: string;
  routeKey: PariwisataRouteKey;
  tabLabel?: string;
  name: string;
  location: string;
  category: string;
  summary?: string;
  description: string;
  bestTime?: string;
  facilities: string[];
  tips: string[];
  packages: PariwisataPaket[];
  gallery: PariwisataMedia[];
  whatsapp: string;
};

export type ProfilLembagaItem = {
  title: string;
  description?: string;
  image: string;
};

export type ProfilFasilitasItem = {
  name: string;
  image: string;
};

export type ProfilDemografiStat = {
  label: string;
  value: string;
};

export type ProfilPage = {
  headerTitle: string;
  headerDescription?: string;
  aboutTitle: string;
  aboutImage: string;
  aboutBody: string[];
  lembagaTitle: string;
  lembagaDescription?: string;
  lembagaItems: ProfilLembagaItem[];
  fasilitasTitle?: string;
  fasilitasDescription?: string;
  fasilitasItems: ProfilFasilitasItem[];
  demografiTitle: string;
  demografiDescription?: string;
  demografiStats: ProfilDemografiStat[];
  demografiNote?: string;
};

// fasilitasItems without a photo are skipped: the marquee is image-only.
export async function getProfilPage() {
  const page = await sanityFetch<
    (Omit<ProfilPage, "aboutBody"> & { aboutBody: PortableTextBlock[] | null }) | null
  >(
    `*[_type == "profilPage" && _id == "profilPage"][0]{
      headerTitle,
      headerDescription,
      aboutTitle,
      "aboutImage": aboutImage.asset->url,
      aboutBody,
      lembagaTitle,
      lembagaDescription,
      "lembagaItems": coalesce(lembagaItems[]{ title, description, "image": image.asset->url }, []),
      fasilitasTitle,
      fasilitasDescription,
      "fasilitasItems": coalesce(
        fasilitasItems[defined(name) && defined(image.asset)]{ name, "image": image.asset->url },
        []
      ),
      demografiTitle,
      demografiDescription,
      "demografiStats": coalesce(demografiStats[]{ label, value }, []),
      demografiNote
    }`,
    {},
    ["profilPage"]
  );

  if (!page) return null;

  return {
    ...page,
    aboutBody: blocksToParagraphs(page.aboutBody),
  } satisfies ProfilPage;
}

export type BerandaPage = {
  heroTitle: string;
  heroDescription?: string;
  heroButtonLabel: string;
  heroButtonLink: string;
  heroImage: string;
  petaTitle: string;
  petaDescription?: string;
  petaAddress: string;
  koperasiTitle: string;
  pariwisataTitle: string;
  pariwisataDescription?: string;
  pariwisataImages: string[];
  umkmTitle: string;
  umkmDescription?: string;
  beritaTitle: string;
};

export async function getBerandaPage() {
  return sanityFetch<BerandaPage | null>(
    `*[_type == "berandaPage" && _id == "berandaPage"][0]{
      heroTitle,
      heroDescription,
      heroButtonLabel,
      heroButtonLink,
      "heroImage": heroImage.asset->url,
      petaTitle,
      petaDescription,
      petaAddress,
      koperasiTitle,
      pariwisataTitle,
      pariwisataDescription,
      "pariwisataImages": coalesce(pariwisataImages[].asset->url, []),
      umkmTitle,
      umkmDescription,
      beritaTitle
    }`,
    {},
    ["berandaPage"]
  );
}

export type PokdarwisPengurus = {
  name: string;
  role: string;
  photo?: string;
};

export type PariwisataPage = {
  headerTitle?: string;
  headerDescription?: string;
  /** Pokdarwis profile; the profile, struktur and pengurus sections need it. */
  groupName?: string;
  shortName?: string;
  stats: { label: string; value: string }[];
  description: string[];
  structureImage?: string;
  pengurus: PokdarwisPengurus[];
  /** Visible destinations only, in the order set in the Studio. */
  destinations: PariwisataDestination[];
};

// Returns null when the singleton hasn't been created yet.
export async function getPariwisataPage() {
  const page = await sanityFetch<
    (Omit<PariwisataPage, "description"> & { description: PortableTextBlock[] | null }) | null
  >(
    `*[_type == "pariwisataPage" && _id == "pariwisataPage"][0]{
      headerTitle,
      headerDescription,
      groupName,
      shortName,
      "stats": coalesce(stats[defined(label) && defined(value)]{ label, value }, []),
      description,
      "structureImage": structureImage.asset->url,
      "pengurus": coalesce(pengurus[defined(name)]{ name, role, "photo": photo.asset->url }, []),
      "destinations": coalesce(destinations[hidden != true && defined(routeKey) && defined(name)]{
        "_id": _key,
        routeKey,
        tabLabel,
        name,
        location,
        category,
        summary,
        description,
        bestTime,
        "facilities": coalesce(facilities, []),
        "tips": coalesce(tips, []),
        "packages": coalesce(packages[defined(label) && defined(total)]{
          label,
          title,
          participants,
          durationHours,
          "items": coalesce(items[defined(name) && defined(price)]{ name, price, unit, note }, []),
          total
        }, []),
        "gallery": coalesce(gallery[defined(asset)]{
          "type": select(_type == "video" => "video", "image"),
          "url": asset->url
        }, []),
        whatsapp
      }, [])
    }`,
    {},
    ["pariwisataPage"]
  );

  if (!page) return null;

  return { ...page, description: blocksToParagraphs(page.description) } satisfies PariwisataPage;
}

export type ListingPageHeader = {
  headerTitle?: string;
  headerDescription?: string;
};

// Header singletons for the list pages (/umkm, /berita). Returns null until
// the document exists; pages then fall back to their built-in text.
export async function getListingPageHeader(type: "umkmPage" | "beritaPage") {
  return sanityFetch<ListingPageHeader | null>(
    `*[_type == $type && _id == $type][0]{ headerTitle, headerDescription }`,
    { type },
    [type]
  );
}

export type PetaLokasi = {
  _id: string;
  name: string;
  category: PetaKategori;
  lat: number;
  lng: number;
  photo?: string;
  description?: string;
  link?: string;
};

export async function getPetaLokasi(): Promise<PetaLokasi[]> {
  const rows = await sanityFetch<
    Array<Omit<PetaLokasi, "lat" | "lng"> & { coordinates?: string }>
  >(
    `*[_type == "petaLokasi" && defined(name) && defined(category)] | order(name asc){
      _id,
      name,
      category,
      coordinates,
      "photo": photo.asset->url,
      description,
      link
    }`,
    {},
    ["petaLokasi"]
  );

  // Coordinates are typed as text in the Studio; skip any that do not parse
  // rather than placing a marker in the wrong spot.
  return rows.flatMap(({ coordinates, ...lokasi }) => {
    const point = parseKoordinat(coordinates);
    return point ? [{ ...lokasi, ...point }] : [];
  });
}
