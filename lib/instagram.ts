import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { INSTAGRAM_SECRETS_ID } from "@/sanity/schemaTypes/instagramSecrets";

// Latest posts per account for the Beranda Instagram section, read with the
// Instagram API (Instagram Login). Server only: it uses SANITY_API_TOKEN to
// read and renew the access tokens stored in the Studio's "Token Instagram".

export type InstagramPost = {
  id: string;
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  imageUrl: string;
  permalink: string;
};

/** username → latest posts; accounts without a working token are left out. */
export type InstagramFeeds = Record<string, InstagramPost[]>;

const POST_LIMIT = 8;
// Instagram's media URLs are signed and expire after a few days, so refetch
// well within that; the page itself revalidates every 60 s.
const FEED_REVALIDATE = 15 * 60;
// Long-lived tokens last 60 days; renew halfway so a few failed tries don't matter.
const REFRESH_AFTER_MS = 30 * 24 * 60 * 60 * 1000;

type StoredToken = { _key: string; username: string; token: string; refreshedAt?: string };

type MediaResponse = {
  data?: {
    id: string;
    caption?: string;
    media_type: InstagramPost["mediaType"];
    media_url?: string;
    thumbnail_url?: string;
    permalink: string;
  }[];
};

export async function getInstagramFeeds(usernames: string[]): Promise<InstagramFeeds> {
  const sanityToken = process.env.SANITY_API_TOKEN;
  if (!sanityToken || usernames.length === 0) return {};

  const client = createClient({ projectId, dataset, apiVersion, token: sanityToken, useCdn: false });
  let tokens: StoredToken[];
  try {
    tokens = await client.fetch<StoredToken[]>(
      `coalesce(*[_id == $id][0].tokens[defined(username) && defined(token)], [])`,
      { id: INSTAGRAM_SECRETS_ID }
    );
  } catch (error) {
    console.error("Instagram: could not read tokens", error);
    return {};
  }

  const wanted = new Set(usernames.map((u) => u.toLowerCase()));
  const entries = await Promise.all(
    tokens
      .filter(({ username }) => wanted.has(username.toLowerCase()))
      .map(async (stored) => {
        const token = await refreshIfDue(client, stored);
        const posts = await fetchPosts(stored.username, token);
        return [stored.username.toLowerCase(), posts] as const;
      })
  );
  return Object.fromEntries(entries.filter(([, posts]) => posts.length > 0));
}

async function fetchPosts(username: string, token: string): Promise<InstagramPost[]> {
  const params = new URLSearchParams({
    fields: "id,caption,media_type,media_url,thumbnail_url,permalink",
    limit: String(POST_LIMIT),
    access_token: token,
  });
  try {
    const res = await fetch(`https://graph.instagram.com/me/media?${params}`, {
      next: { revalidate: FEED_REVALIDATE },
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const { data = [] } = (await res.json()) as MediaResponse;
    return data.flatMap((m) => {
      // Videos are shown by their cover image.
      const imageUrl = m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url;
      return imageUrl
        ? [{ id: m.id, caption: m.caption, mediaType: m.media_type, imageUrl, permalink: m.permalink }]
        : [];
    });
  } catch (error) {
    console.error(`Instagram: could not load @${username}`, error);
    return [];
  }
}

/** Renews a token older than REFRESH_AFTER_MS and saves it; returns the token to use. */
async function refreshIfDue(client: ReturnType<typeof createClient>, stored: StoredToken) {
  const last = stored.refreshedAt ? Date.parse(stored.refreshedAt) : 0;
  if (Date.now() - last < REFRESH_AFTER_MS) return stored.token;

  try {
    const params = new URLSearchParams({ grant_type: "ig_refresh_token", access_token: stored.token });
    // Cached by URL (i.e. per old token) so concurrent renders refresh only once.
    const res = await fetch(`https://graph.instagram.com/refresh_access_token?${params}`, {
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const { access_token } = (await res.json()) as { access_token?: string };
    if (!access_token) throw new Error("no access_token in response");

    await client
      .patch(INSTAGRAM_SECRETS_ID)
      .set({
        [`tokens[_key=="${stored._key}"].token`]: access_token,
        [`tokens[_key=="${stored._key}"].refreshedAt`]: new Date().toISOString(),
      })
      .commit();
    return access_token;
  } catch (error) {
    // Keep using the current token; it stays valid until 60 days after its last renewal.
    console.error(`Instagram: could not refresh token for @${stored.username}`, error);
    return stored.token;
  }
}
