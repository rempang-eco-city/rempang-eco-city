export type UmkmCategory = "Kuliner" | "Kerajinan" | "Jasa";

export type UmkmProduct = {
  name: string;
  price: string;
  image: string;
};

export type UmkmItem = {
  id: string;
  slug: string;
  name: string;
  category: UmkmCategory;
  image: string;
  cardDescription: string;
  description: string;
  location: string;
  owner: string;
  whatsapp: string;
  shopee?: string;
  gallery: string[];
  products: UmkmProduct[];
};

export const umkmCatalog: UmkmItem[] = [
  {
    id: "ernawati-pastel",
    slug: "ernawati-pastel",
    name: "Ernawati Pastel",
    category: "Kuliner",
    image: "/images/umkm/Ernawati-Pastel/hero-ernawati-pastel.jpg",
    cardDescription: "Pastel rumahan dengan cita rasa gurih dan renyah.",
    description: "Melayani pesanan pastel untuk harian dan acara.",
    location: "Rempang",
    owner: "Ibu Ernawati",
    whatsapp: "https://wa.me/6281234567801",
    gallery: [
      "/images/umkm/Ernawati-Pastel/hero-ernawati-pastel.jpg",
      "/images/umkm/Ernawati-Pastel/product-ep-1.jpeg",
      "/images/umkm/Ernawati-Pastel/product-ep-2.jpeg",
      "/images/umkm/Ernawati-Pastel/product-ep-3.jpeg",
    ],
    products: [
      { name: "Pastel Original", price: "Mulai Rp 2.000/pcs", image: "/images/umkm/Ernawati-Pastel/product-ep-1.jpeg" },
      { name: "Pastel Isi", price: "Mulai Rp 2.500/pcs", image: "/images/umkm/Ernawati-Pastel/product-ep-2.jpeg" },
      { name: "Pastel Box", price: "Mulai Rp 25.000/box", image: "/images/umkm/Ernawati-Pastel/product-ep-3.jpeg" },
    ],
  },
  {
    id: "home-cakes",
    slug: "home-cakes",
    name: "Home Cakes",
    category: "Kuliner",
    image: "/images/umkm/Home-Cakes/umkm-home-cakes.jpg",
    cardDescription: "Aneka kue dan dessert rumahan.",
    description: "Melayani pesanan kue harian dan paket acara.",
    location: "Rempang",
    owner: "Home Cakes",
    whatsapp: "https://wa.me/6281234567802",
    gallery: [
      "/images/umkm/Home-Cakes/umkm-home-cakes.jpg",
      "/images/umkm/Home-Cakes/umkm-hc-1.jpg",
      "/images/umkm/Home-Cakes/umkm-hc-2.jpg",
      "/images/umkm/Home-Cakes/umkm-hc-3.jpg",
    ],
    products: [
      { name: "Risol Mayo", price: "Mulai Rp 8.000", image: "/images/umkm/Home-Cakes/umkm-hc-1.jpg" },
      { name: "Donat 1//2 Lusin", price: "Mulai Rp 20.000", image: "/images/umkm/Home-Cakes/umkm-hc-2.jpg" },
      { name: "Brownies", price: "Mulai Rp 30.000", image: "/images/umkm/Home-Cakes/umkm-hc-3.jpg" },
    ],
  },
  {
    id: "katering-rf",
    slug: "katering-rf",
    name: "Katering RF",
    category: "Kuliner",
    image: "/images/umkm/Katering-RF/umkm-katering-rf.jpg",
    cardDescription: "Layanan katering rumahan untuk harian dan acara.",
    description: "Menyediakan nasi box dan paket konsumsi.",
    location: "Rempang",
    owner: "Katering RF",
    whatsapp: "https://wa.me/6281234567803",
    gallery: [
      "/images/umkm/Katering-RF/umkm-katering-rf.jpg",
      "/images/umkm/Katering-RF/umkm-krf-1.jpg",
    ],
    products: [{ name: "Nasi Box", price: "Mulai Rp 25.000/box", image: "/images/umkm/Katering-RF/umkm-krf-1.jpg" }],
  },
  {
    id: "nengcia-otak-otak",
    slug: "nengcia-otak-otak",
    name: "NengCia Otak-Otak",
    category: "Kuliner",
    image: "/images/umkm/NengCia-Otak-Otak/umkm-nengcia-otakotak.jpg",
    cardDescription: "Otak-otak khas pesisir dengan bumbu gurih.",
    description: "Melayani pesanan otak-otak harian dan acara.",
    location: "Rempang",
    owner: "NengCia",
    whatsapp: "https://wa.me/6281234567805",
    gallery: [
      "/images/umkm/NengCia-Otak-Otak/umkm-nengcia-otakotak.jpg",
      "/images/umkm/NengCia-Otak-Otak/umkm-no-1.jpg",
    ],
    products: [{ name: "Otak-Otak", price: "Mulai Rp 20.000", image: "/images/umkm/NengCia-Otak-Otak/umkm-no-1.jpg" }],
  },
  {
    id: "peyek-shamellsha",
    slug: "peyek-shamellsha",
    name: "Peyek Shamellsha",
    category: "Kuliner",
    image: "/images/umkm/Peyek-Shamellsha/umkm-peyek-shamellsha.jpg",
    cardDescription: "Peyek kacang renyah kemasan siap jual.",
    description: "Cocok untuk camilan dan oleh-oleh.",
    location: "Rempang",
    owner: "Shamellsha",
    whatsapp: "https://wa.me/6281234567806",
    gallery: [
      "/images/umkm/Peyek-Shamellsha/umkm-peyek-shamellsha.jpg",
      "/images/umkm/Peyek-Shamellsha/umkm-ps-1.jpg",
    ],
    products: [{ name: "Peyek Kacang", price: "Mulai Rp 15.000/pack", image: "/images/umkm/Peyek-Shamellsha/umkm-ps-1.jpg" }],
  },
  {
    id: "saemah-otak-otak",
    slug: "saemah-otak-otak",
    name: "Saemah Otak-Otak",
    category: "Kuliner",
    image: "/images/umkm/Saemah-Otak-Otak/hero-saemah-otakotak.jpg",
    cardDescription: "Otak-otak daun khas lokal.",
    description: "Diproduksi rumahan dengan bahan ikan segar.",
    location: "Rempang",
    owner: "Ibu Saemah",
    whatsapp: "https://wa.me/6281234567807",
    gallery: [
      "/images/umkm/Saemah-Otak-Otak/hero-saemah-otakotak.jpg",
      "/images/umkm/Saemah-Otak-Otak/umkm-so-1.jpeg",
      "/images/umkm/Saemah-Otak-Otak/umkm-so-2.jpeg",
      "/images/umkm/Saemah-Otak-Otak/umkm-so-3.jpeg",
      "/images/umkm/Saemah-Otak-Otak/umkm-so-4.jpeg",
    ],
    products: [
      { name: "Otak-Otak Bakar", price: "Mulai Rp 20.000", image: "/images/umkm/Saemah-Otak-Otak/umkm-so-1.jpeg" },
      { name: "Otak-Otak Mentah", price: "Mulai Rp 15.000", image: "/images/umkm/Saemah-Otak-Otak/umkm-so-2.jpeg" },
    ],
  },
];

export const umkmCategories = ["Semua", ...Array.from(new Set(umkmCatalog.map((item) => item.category)))];