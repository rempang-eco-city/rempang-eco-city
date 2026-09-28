"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FEATURES } from "@/lib/features";

const allNavLinks = [
	{ label: "Beranda", href: "/" },
	{ label: "Profil REC", href: "/profil" },
	{
		label: "Koperasi",
		href: "/koperasi",
		items: [
			{ label: "Koperasi Transmigrasi", href: "/koperasi/transmigrasi" },
			{ label: "Koperasi Merah Putih", href: "/koperasi/merah-putih" },
		],
	},
	{ label: "Pariwisata", href: "/pariwisata" },
	{ label: "UMKM", href: "/umkm" },
	{ label: "Berita", href: "/berita" },
];

const navLinks = allNavLinks.filter(
	(link) => FEATURES.pariwisata || link.href !== "/pariwisata"
);

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "unset";
	}, [isOpen]);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-white shadow-md border-b border-border-color"
					: "bg-white border-b border-border-color"
			}`}
		>
			<nav className="container-content flex items-center justify-between py-4 md:py-5">
				<Link href="/" className="flex items-center gap-3 text-primary-blue">
					<img
						src="/images/logo-kementrans.png"
						alt="Logo Rempang Eco City"
						className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-blue/20 shadow-sm"
					/>
					<span className="font-heading font-bold text-lg md:text-xl">
						Rempang Eco City
					</span>
				</Link>

				<div className="hidden md:flex items-center gap-1">
					{navLinks.map((link) => {
						if ("items" in link && link.items) {
							return (
								<div
									key={link.href}
									className="relative"
									onMouseEnter={() => setOpenDropdown(link.label)}
									onMouseLeave={() => setOpenDropdown(null)}
								>
									<button
										type="button"
										className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-text-primary hover:text-primary-blue transition-colors"
										onClick={() =>
											setOpenDropdown((prev) =>
												prev === link.label ? null : link.label
											)
										}
									>
										{link.label}
										<ChevronDown
											size={14}
											className={`transition-transform ${
												openDropdown === link.label ? "rotate-180" : ""
											}`}
										/>
									</button>

									<AnimatePresence>
										{openDropdown === link.label && (
											<motion.div
												initial={{ opacity: 0, y: 8 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 8 }}
												transition={{ duration: 0.15 }}
												className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-border-color bg-white p-2 shadow-lg"
											>
												{link.items.map((item) => (
													<Link
														key={item.label}
														href={item.href}
														onClick={() => setOpenDropdown(null)}
														className="block rounded-lg px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-light hover:text-primary-blue transition-colors"
													>
														{item.label}
													</Link>
												))}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							);
						}

						return (
							<Link
								key={link.href}
								href={link.href}
								className="px-4 py-2 text-sm font-medium text-text-primary hover:text-primary-blue transition-colors"
							>
								{link.label}
							</Link>
						);
					})}
				</div>

				<button
					onClick={() => setIsOpen(!isOpen)}
					className="md:hidden p-2 text-text-primary hover:bg-bg-light rounded-lg transition-colors"
					aria-label="Toggle menu"
				>
					{isOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</nav>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="md:hidden border-t border-border-color bg-white"
					>
						<div className="container-content py-4 space-y-2">
							{navLinks.map((link) => {
								if ("items" in link && link.items) {
									return (
										<div
											key={link.label}
											className="rounded-lg border border-border-color bg-bg-light/40"
										>
											<button
												type="button"
												onClick={() =>
													setOpenDropdown((prev) =>
														prev === link.label ? null : link.label
													)
												}
												className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-text-primary"
											>
												{link.label}
												<ChevronDown
													size={14}
													className={`transition-transform ${
														openDropdown === link.label ? "rotate-180" : ""
													}`}
												/>
											</button>

											{openDropdown === link.label && (
												<div className="border-t border-border-color px-3 py-2 space-y-1">
													{link.items.map((item) => (
														<Link
															key={item.label}
															href={item.href}
															onClick={() => {
																setOpenDropdown(null);
																setIsOpen(false);
															}}
															className="block rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-white hover:text-primary-blue transition-colors"
														>
															{item.label}
														</Link>
													))}
												</div>
											)}
										</div>
									);
								}

								return (
									<Link
										key={link.href}
										href={link.href}
										onClick={() => setIsOpen(false)}
										className="block px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-light rounded-lg transition-colors"
									>
										{link.label}
									</Link>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="h-1 bg-gradient-to-r from-primary-yellow to-primary-yellow/0"></div>
		</header>
	);
}
