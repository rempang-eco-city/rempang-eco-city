"use client";

import { forwardRef, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Clapperboard, Copy, Instagram } from "lucide-react";
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
  /** Latest posts per lowercase username; accounts without posts just link to Instagram. */
  feeds: InstagramFeeds;
};

export default function InstagramSection({ title, description, accounts, feeds }: Props) {
  const withPosts = accounts.filter(({ username }) => feeds[username.toLowerCase()]?.length);
  const [activeUsername, setActiveUsername] = useState(withPosts[0]?.username);
  const feedRef = useRef<HTMLDivElement>(null);
  if (accounts.length === 0) return null;

  const active = withPosts.find(({ username }) => username === activeUsername) ?? withPosts[0];

  // The cards sit below the feed; when the feed has scrolled out of view (e.g.
  // on phones, where the cards stack), bring it back so the switch is visible.
  function selectAccount(username: string) {
    setActiveUsername(username);
    const feed = feedRef.current;
    if (feed && feed.getBoundingClientRect().top < 0) {
      feed.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

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

        {active && (
          <InstagramFeed
            ref={feedRef}
            account={active}
            posts={feeds[active.username.toLowerCase()]}
          />
        )}

        {/* Accounts with a feed choose which one shows above; the others link to Instagram. */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {accounts.map((account, index) => {
            const hasFeed = withPosts.includes(account);
            const isActive = account === active;
            const animation = {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: index * 0.08 },
            };
            const cardClassName = `group flex flex-col rounded-2xl border bg-white p-6 text-left shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all ${
              isActive
                ? "border-primary-blue ring-2 ring-primary-blue/20"
                : "border-border-color hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
            }`;
            const body = <AccountCardBody account={account} />;

            if (!hasFeed) {
              return (
                <motion.a
                  key={account.username}
                  href={`https://www.instagram.com/${account.username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...animation}
                  className={cardClassName}
                >
                  {body}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-semibold text-primary-blue transition-colors group-hover:text-primary-dark">
                    Kunjungi Instagram
                    <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </motion.a>
              );
            }

            return (
              <motion.button
                key={account.username}
                type="button"
                onClick={() => selectAccount(account.username)}
                aria-pressed={isActive}
                {...animation}
                className={cardClassName}
              >
                {body}
                {isActive ? (
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-semibold text-primary-blue">
                    <Check size={18} />
                    Sedang ditampilkan
                  </span>
                ) : (
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-semibold text-text-secondary transition-colors group-hover:text-primary-blue">
                    Lihat postingan
                    <ArrowUp size={18} className="transition-transform group-hover:-translate-y-0.5" />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AccountCardBody({ account }: { account: InstagramAccount }) {
  return (
    <>
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
    </>
  );
}

const MEDIA_BADGE: Partial<Record<InstagramPost["mediaType"], typeof Copy>> = {
  VIDEO: Clapperboard,
  CAROUSEL_ALBUM: Copy,
};

type FeedProps = { account: InstagramAccount; posts: InstagramPost[] };

/** Latest posts of the account chosen with the cards below it. */
const InstagramFeed = forwardRef<HTMLDivElement, FeedProps>(function InstagramFeed(
  { account, posts },
  ref
) {
  const profileUrl = `https://www.instagram.com/${account.username}/`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10 scroll-mt-28 rounded-2xl border border-border-color bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.03)] md:p-6"
    >
      {/* Keyed by account so switching fades the new posts in. */}
      <motion.div
        key={account.username}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
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
            className="inline-flex items-center gap-2 rounded-full bg-primary-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Instagram size={16} />
            Ikuti di Instagram
          </a>
        </div>

        {/* 4 columns for 8 posts; 3 for Behold's free-plan 6, so no row is half empty. */}
        <div
          className={`grid grid-cols-2 gap-2 md:gap-3 ${
            posts.length % 4 === 0 ? "md:grid-cols-4" : "md:grid-cols-3"
          }`}
        >
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
                {/* Thin outline so posts with a white background don't melt into the card */}
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
                {Badge && (
                  <span className="absolute right-2 top-2 rounded-full bg-black/45 p-1.5 text-white" aria-hidden="true">
                    <Badge size={14} />
                  </span>
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
    </motion.div>
  );
});

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
