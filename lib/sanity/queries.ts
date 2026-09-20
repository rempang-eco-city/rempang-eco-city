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
  content: string[];
};

const newsListProjection = `{
  _id,
  title,
  "slug": slug.current,
  category,
  date,
  excerpt,
  "image": image.asset->url,
  featured
}`;

export async function getNewsArticles() {
  return sanityFetch<NewsArticleListItem[]>(
    `*[_type == "newsArticle"] | order(_createdAt desc) ${newsListProjection}`,
    {},
    ["newsArticle"]
  );
}

export async function getNewsArticleBySlug(slug: string) {
  const article = await sanityFetch<
    | (NewsArticleListItem & {
        content: Array<{ children?: Array<{ text?: string }> }> | null;
      })
    | null
  >(
    `*[_type == "newsArticle" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, category, date, excerpt, content, "image": image.asset->url, featured
    }`,
    { slug },
    ["newsArticle"]
  );

  if (!article) return null;

  const paragraphs =
    article.content?.map(
      (block) => block.children?.map((span) => span.text ?? "").join("") ?? ""
    ) ?? [];

  return { ...article, content: paragraphs } satisfies NewsArticleDetail;
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
