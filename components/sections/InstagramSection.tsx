"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clapperboard, Copy, Instagram } from "lucide-react";
import type { InstagramAccount } from "@/lib/sanity/queries";
import type { InstagramFeeds, InstagramPost } from "@/lib/instagram";
import { sanityImageUrl } from "@/lib/sanity/image";

// Instagram's brand gradient.
const INSTAGRAM_GRADIENT =
  "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)";

type Props = {
  title?: string;
  description?: string;
  accounts: InstagramAccount[];
  /** Latest posts per lowercase username; accounts without posts get no feed tab. */
  feeds: InstagramFeeds;
};

export default function InstagramSection({ title, description, accounts, feeds }: Props) {
  if (accounts.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-primary-blue md:text-4xl">
            {title || "Ikuti Kami di Instagram"}
          </h2>
          {description && (
            <p className="mt-3 text-base leading-relaxed text-text-secondary">{description}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {accounts.map((account, index) => (
            <motion.a
              key={account.username}
              href={`https://www.instagram.com/${account.username}/`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group flex flex-col rounded-2xl border border-border-color bg-white p-6 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-center gap-4">
                <Avatar account={account} />
                <div className="min-w-0">
                  <p className="break-words font-heading text-lg font-bold leading-snug text-text-primary">
                    {account.name || `@${account.username}`}
                  </p>
                  {account.name && (
                    <p className="truncate text-sm text-text-secondary">@{account.username}</p>
                  )}
                </div>
              </div>

              {account.description && (
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">{account.description}</p>
              )}

              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-semibold text-primary-blue transition-colors group-hover:text-primary-dark">
                Kunjungi Instagram
                <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </motion.a>
          ))}
        </div>

        <InstagramFeed accounts={accounts} feeds={feeds} />
      </div>
    </section>
  );
}

const MEDIA_BADGE: Partial<Record<InstagramPost["mediaType"], typeof Copy>> = {
  VIDEO: Clapperboard,
  CAROUSEL_ALBUM: Copy,
};

/** Latest posts of one account at a time, with a tab per account that has posts. */
function InstagramFeed({ accounts, feeds }: { accounts: InstagramAccount[]; feeds: InstagramFeeds }) {
  const withPosts = accounts.filter(({ username }) => feeds[username.toLowerCase()]?.length);
  const [activeUsername, setActiveUsername] = useState(withPosts[0]?.username);
  if (withPosts.length === 0) return null;

  const account = withPosts.find(({ username }) => username === activeUsername) ?? withPosts[0];
  const posts = feeds[account.username.toLowerCase()];
  const profileUrl = `https://www.instagram.com/${account.username}/`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-10 rounded-2xl border border-border-color bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.03)] md:p-6"
    >
      {withPosts.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Pilih akun Instagram">
          {withPosts.map(({ username }) => {
            const active = username === account.username;
            return (
              <button
                key={username}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveUsername(username)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary-blue text-white"
                    : "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary"
                }`}
              >
                @{username}
              </button>
            );
          })}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar account={account} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-heading font-bold text-text-primary">@{account.username}</p>
            {account.name && <p className="truncate text-sm text-text-secondary">{account.name}</p>}
          </div>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: INSTAGRAM_GRADIENT }}
        >
          <Instagram size={16} />
          Ikuti di Instagram
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {posts.map((post) => {
          const Badge = MEDIA_BADGE[post.mediaType];
          return (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-xl bg-slate-100"
            >
              <img
                src={post.imageUrl}
                alt={post.caption?.slice(0, 120) || `Postingan Instagram @${account.username}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {Badge && (
                <Badge
                  size={18}
                  className="absolute right-2 top-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  aria-hidden="true"
                />
              )}
              {post.caption && (
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="line-clamp-3 text-xs leading-relaxed text-white">{post.caption}</span>
                </span>
              )}
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}

/** Profile photo in Instagram's gradient ring, or the Instagram logo without one. */
function Avatar({ account, size = "md" }: { account: InstagramAccount; size?: "sm" | "md" }) {
  const small = size === "sm";
  if (!account.photo) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center text-white ${
          small ? "h-10 w-10 rounded-xl" : "h-14 w-14 rounded-2xl"
        }`}
        style={{ background: INSTAGRAM_GRADIENT }}
        aria-hidden="true"
      >
        <Instagram size={small ? 20 : 28} strokeWidth={2} />
      </span>
    );
  }

  return (
    <span className="relative shrink-0" aria-hidden="true">
      <span className="block rounded-full p-[3px]" style={{ background: INSTAGRAM_GRADIENT }}>
        <img
          src={sanityImageUrl(account.photo, 160)}
          alt=""
          className={`${small ? "h-10 w-10" : "h-14 w-14"} rounded-full border-2 border-white object-cover`}
        />
      </span>
      {!small && (
        <span
          className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white"
          style={{ background: INSTAGRAM_GRADIENT }}
        >
          <Instagram size={12} strokeWidth={2.5} />
        </span>
      )}
    </span>
  );
}
