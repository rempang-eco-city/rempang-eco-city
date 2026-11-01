import type { InstagramAccount } from "@/lib/sanity/queries";

// Latest posts per account for the Beranda Instagram section, read from each
// account's Behold JSON feed (behold.so handles the Instagram login and tokens).
// Feed format: https://behold.so/docs/json-feeds

export type InstagramPost = {
  id: string;
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  imageUrl: string;
  permalink: string;
};

/** Lowercase username → latest posts; accounts without a working feed are left out. */
export type InstagramFeeds = Record<string, InstagramPost[]>;

const POST_LIMIT = 8;
// Behold refreshes free feeds daily (paid: within minutes), so hourly is plenty
// and keeps the request count well inside its plan limits.
const FEED_REVALIDATE = 60 * 60;

type BeholdSize = { mediaUrl?: string };

type BeholdFeed = {
  posts?: {
    id: string;
    mediaType: InstagramPost["mediaType"];
    permalink: string;
    caption?: string;
    prunedCaption?: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
    sizes?: { small?: BeholdSize; medium?: BeholdSize; large?: BeholdSize };
  }[];
};

export async function getInstagramFeeds(accounts: InstagramAccount[]): Promise<InstagramFeeds> {
  const entries = await Promise.all(
    accounts
      .filter((account): account is InstagramAccount & { feedUrl: string } => Boolean(account.feedUrl))
      .map(async ({ username, feedUrl }) => [username.toLowerCase(), await fetchPosts(username, feedUrl)] as const)
  );
  return Object.fromEntries(entries.filter(([, posts]) => posts.length > 0));
}

async function fetchPosts(username: string, feedUrl: string): Promise<InstagramPost[]> {
  try {
    const res = await fetch(feedUrl, { next: { revalidate: FEED_REVALIDATE } });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const { posts = [] } = (await res.json()) as BeholdFeed;
    return posts.slice(0, POST_LIMIT).flatMap((post) => {
      // Behold's resized WebP copies; Instagram's own URLs are huge and expire.
      const imageUrl =
        post.sizes?.medium?.mediaUrl ??
        post.sizes?.large?.mediaUrl ??
        (post.mediaType === "VIDEO" ? post.thumbnailUrl : post.mediaUrl);
      return imageUrl
        ? [
            {
              id: post.id,
              caption: post.prunedCaption || post.caption,
              mediaType: post.mediaType,
              imageUrl,
              permalink: post.permalink,
            },
          ]
        : [];
    });
  } catch (error) {
    console.error(`Instagram: could not load the Behold feed for @${username}`, error);
    return [];
  }
}
