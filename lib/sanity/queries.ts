import type { PortableTextBlock as RichTextBlock } from "@portabletext/react";
import { sanityClient } from "./client";

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
    | (Omit<KoperasiDetail, "about" | "pengurus" | "galleryItems" | "laporanKeuangan"> & {
        about: PortableTextBlock[] | null;
        pengurus: KoperasiPengurus[] | null;
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

export type PariwisataRouteKey = "mancing" | "mangrove";

export type PariwisataDestination = {
  _id: string;
  routeKey: PariwisataRouteKey;
  name: string;
  location: string;
  category: string;
  summary?: string;
  description: string;
  bestTime: string;
  facilities: string[];
  tips: string[];
  gallery: string[];
  whatsapp: string;
};

export async function getPariwisataDestinations() {
  return sanityFetch<PariwisataDestination[]>(
    `*[_type == "pariwisataDestination"] | order(_createdAt asc) {
      _id,
      routeKey,
      name,
      location,
      category,
      summary,
      description,
      bestTime,
      "facilities": coalesce(facilities, []),
      "tips": coalesce(tips, []),
      "gallery": coalesce(gallery[].asset->url, []),
      whatsapp
    }`,
    {},
    ["pariwisataDestination"]
  );
}

export type ProfilLembagaItem = {
  title: string;
  description?: string;
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
  demografiTitle: string;
  demografiDescription?: string;
  demografiStats: ProfilDemografiStat[];
  demografiNote?: string;
};

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
