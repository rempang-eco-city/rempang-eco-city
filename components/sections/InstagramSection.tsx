"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Instagram } from "lucide-react";
import type { InstagramAccount } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

// Instagram's brand gradient.
const INSTAGRAM_GRADIENT =
  "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)";

type Props = {
  title?: string;
  description?: string;
  accounts: InstagramAccount[];
};

export default function InstagramSection({ title, description, accounts }: Props) {
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
      </div>
    </section>
  );
}

/** Profile photo in Instagram's gradient ring, or the Instagram logo without one. */
function Avatar({ account }: { account: InstagramAccount }) {
  if (!account.photo) {
    return (
      <span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
        style={{ background: INSTAGRAM_GRADIENT }}
        aria-hidden="true"
      >
        <Instagram size={28} strokeWidth={2} />
      </span>
    );
  }

  return (
    <span className="relative shrink-0" aria-hidden="true">
      <span className="block rounded-full p-[3px]" style={{ background: INSTAGRAM_GRADIENT }}>
        <img
          src={sanityImageUrl(account.photo, 160)}
          alt=""
          className="h-14 w-14 rounded-full border-2 border-white object-cover"
        />
      </span>
      <span
        className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white"
        style={{ background: INSTAGRAM_GRADIENT }}
      >
        <Instagram size={12} strokeWidth={2.5} />
      </span>
    </span>
  );
}
