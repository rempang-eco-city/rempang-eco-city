"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { KoperasiListItem } from "@/lib/sanity/queries";

export default function KoperasiSection({
	title,
	koperasiList,
}: {
	title: string;
	koperasiList: KoperasiListItem[];
}) {
	if (koperasiList.length === 0) return null;

	return (
		<section className="bg-white py-16 md:py-24">
			<div className="container-content">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-blue mb-3">
						{title}
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{koperasiList.map((item, index) => (
						<motion.article
							key={item._id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition-all hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
						>
							<div className="overflow-hidden">
								<img
									src={item.heroImage}
									alt={item.name}
									className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>

							<div className="p-5 md:p-6">
								<h3 className="font-heading text-2xl font-bold text-primary-blue mb-3">
									{item.name}
								</h3>

								<p className="text-base leading-relaxed text-text-secondary mb-6 min-h-[72px]">
									{item.homeCardDescription}
								</p>

								<Link
									href={`/koperasi/${item.routeKey}`}
									className="inline-flex items-center gap-2 text-base font-semibold text-primary-blue transition-colors hover:text-primary-dark"
								>
									Lihat Lebih
									<span aria-hidden="true">→</span>
								</Link>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
