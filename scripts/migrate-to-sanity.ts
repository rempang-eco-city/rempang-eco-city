/**
 * One-off migration script: reads local data/*.ts arrays, uploads referenced
 * images to Sanity Assets, then creates/updates matching Sanity documents.
 *
 * This script is NOT run automatically. Review it, make sure SANITY_API_TOKEN
 * in .env.local has "Editor" (write) permission, then run manually:
 *
 *   npm run migrate:sanity
 *
 * Documents use deterministic _id values and are written with
 * createOrReplace, so re-running updates the same docs instead of duplicating
 * them. That also means re-running OVERWRITES any edits made in the Studio for
 * those documents — use --only to limit which sections are migrated:
 *
 *   npm run migrate:sanity -- --only=koperasi,pariwisata
 *
 * Sections: news, umkm, koperasi, pariwisata, profil, beranda. --only is required.
 *
 * Documents created in the Studio have random _ids, so migrating a section
 * that was already filled in by hand creates DUPLICATES rather than updates.
 */
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { createClient, type SanityClient } from "@sanity/client";

import { umkmCatalog } from "../data/umkmCatalog";

// Next.js keeps secrets in .env.local, which dotenv does not read by default.
dotenv.config({ path: ".env.local" });

// Snapshot of the news content that was hardcoded in the site before Sanity.
const newsArticles: Array<{
  slug: string;
  title: string;
  category:
    | "Development"
    | "Community"
    | "Investment"
    | "Sustainability"
    | "Events";
  publishedAt: string;
  excerpt: string;
  image: string;
  featured: boolean;
  content: string[];
}> = [
  {
    slug: "dimulainya-pembangunan-infrastruktur-fase-pertama",
    title: "Dimulainya Pembangunan Infrastruktur Fase Pertama",
    category: "Development",
    publishedAt: "2026-08-01",
    excerpt:
      "Proyek konstruksi jalan dan persiapan lahan telah dimulai di sepanjang garis pantai utara Rempang.",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop",
    featured: true,
    content: [
      "Proyek pembangunan infrastruktur fase pertama Rempang Eco City telah resmi dimulai. Proyek konstruksi jalan dan persiapan lahan sedang berlangsung di sepanjang garis pantai utara Rempang dengan target penyelesaian dalam 18 bulan. Tim konstruksi yang terdiri dari lebih dari 500 pekerja telah ditempatkan di lokasi untuk memastikan kelancaran proyek ini. Infrastruktur yang dibangun mencakup jalan raya utama, jaringan air bersih, dan sistem drainase yang canggih.",
      "Proyek ini merupakan fondasi penting dalam mewujudkan visi Rempang Eco City sebagai kota berkelanjutan masa depan. Dengan menggunakan teknologi terkini dan praktik konstruksi ramah lingkungan, kami memastikan bahwa setiap aspek pembangunan sejalan dengan komitmen kami terhadap keberlanjutan.",
      "Peringkat keselamatan kerja telah ditetapkan sebagai prioritas utama dengan penerapan standar internasional di seluruh lokasi konstruksi. Kami berkomitmen untuk menyelesaikan fase pertama ini sesuai jadwal dan anggaran yang telah ditetapkan.",
    ],
  },
  {
    slug: "program-transisi-komunitas-mencapai-milestone-baru",
    title: "Program Transisi Komunitas Mencapai Milestone Baru",
    category: "Community",
    publishedAt: "2026-07-01",
    excerpt:
      "Dukungan perumahan dan mata pencaharian berkelanjutan untuk keluarga yang pindah.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop",
    featured: false,
    content: [
      "Program transisi komunitas Rempang Eco City telah mencapai milestone penting dengan penyelesaian fase pertama relokasi. Lebih dari 1000 keluarga telah dipindahkan ke perumahan baru yang tersedia dengan dukungan penuh dari pemerintah.",
      "Program ini juga mencakup pelatihan keterampilan dan bantuan modal usaha untuk memastikan kehidupan ekonomi komunitas tetap stabil. Kepuasan penerima manfaat mencapai 95% berdasarkan survei terbaru, menunjukkan bahwa program ini telah berhasil menciptakan dampak positif bagi ribuan keluarga.",
      "Untuk fase berikutnya, kami akan fokus pada pengembangan usaha mikro dan kecil (UMKM) yang didukung penuh oleh program pelatihan dan pendampingan intensif. Investasi dalam pengembangan sumber daya manusia akan memastikan komunitas Rempang tidak hanya lolos dari proses transisi, tetapi juga berkembang dan sejahtera.",
    ],
  },
  {
    slug: "mitra-energi-terbarukan-pertama-diumumkan",
    title: "Mitra Energi Terbarukan Pertama Diumumkan",
    category: "Sustainability",
    publishedAt: "2026-06-01",
    excerpt:
      "Kemitraan baru bertujuan menghadirkan infrastruktur tenaga surya dan pembangkit rendah karbon.",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1600&auto=format&fit=crop",
    featured: false,
    content: [
      "Rempang Eco City telah menandatangani perjanjian kemitraan dengan perusahaan energi terbarukan terkemuka untuk mengembangkan infrastruktur energi terbarukan. Proyek ini akan menghasilkan 500 MW tenaga surya dan 200 MW tenaga angin, menjadikan Rempang Eco City sebagai pusat energi terbarukan terbesar di kawasan.",
      "Investasi total mencapai 2 triliun rupiah, dengan target operasional dimulai pada tahun 2028. Kemitraan strategis ini menunjukkan komitmen Rempang Eco City untuk menjadi pemimpin dalam transisi energi global dan mengurangi emisi karbon.",
      "Selain itu, proyek ini juga akan menciptakan lapangan kerja baru bagi lebih dari 5000 orang dalam berbagai sektor, mulai dari konstruksi, operasi dan pemeliharaan, hingga penelitian dan pengembangan. Dukungan dari universitas lokal dan lembaga penelitian akan memastikan transfer teknologi yang berkelanjutan dan pengembangan kapabilitas lokal.",
    ],
  },
  {
    slug: "peluncuran-pasar-digital-umkm-rempang",
    title: "Peluncuran Pasar Digital UMKM Rempang",
    category: "Investment",
    publishedAt: "2026-09-01",
    excerpt:
      "Platform online lokal diluncurkan untuk membantu UMKM Rempang menjangkau pembeli nasional dan internasional.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
    featured: false,
    content: [
      "Platform online lokal diluncurkan untuk membantu UMKM Rempang menjangkau pembeli nasional dan internasional.",
    ],
  },
];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN in .env.local"
  );
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Avoid re-uploading the same source image more than once per run.
const assetCache = new Map<string, string>();

async function resolveImageSource(imagePath: string): Promise<Buffer> {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    const res = await fetch(imagePath);
    if (!res.ok) {
      throw new Error(`Failed to fetch image ${imagePath}: ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  const absolutePath = path.join(process.cwd(), "public", imagePath);
  return fs.readFileSync(absolutePath);
}

async function uploadImage(imagePath: string) {
  const cached = assetCache.get(imagePath);
  if (cached) {
    return { _type: "reference" as const, _ref: cached };
  }

  const buffer = await resolveImageSource(imagePath);
  const filename = path.basename(imagePath.split("?")[0]);
  const asset = await client.assets.upload("image", buffer, { filename });

  assetCache.set(imagePath, asset._id);
  return { _type: "reference" as const, _ref: asset._id };
}

async function imageField(imagePath: string) {
  return {
    _type: "image" as const,
    asset: await uploadImage(imagePath),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function migrateNewsArticles() {
  console.log(`\nMigrating ${newsArticles.length} news articles...`);

  for (const article of newsArticles) {
    const doc = {
      _id: `newsArticle-${article.slug}`,
      _type: "newsArticle",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      category: article.category,
      publishedAt: article.publishedAt,
      excerpt: article.excerpt,
      content: article.content.map((paragraph, index) => ({
        _type: "block",
        _key: `p${index}`,
        style: "normal",
        children: [{ _type: "span", _key: `p${index}-span`, text: paragraph }],
      })),
      image: await imageField(article.image),
      featured: article.featured,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${article.title}`);
  }
}

async function migrateUmkmCatalog() {
  console.log(`\nMigrating ${umkmCatalog.length} UMKM items...`);

  for (const umkm of umkmCatalog) {
    const gallery = await Promise.all(
      umkm.gallery.map(async (imagePath) => ({
        _type: "image" as const,
        _key: slugify(imagePath),
        asset: await uploadImage(imagePath),
      }))
    );

    const products = await Promise.all(
      umkm.products.map(async (product) => ({
        _type: "umkmProduct" as const,
        _key: slugify(`${product.name}-${product.price}`),
        name: product.name,
        price: product.price,
        image: await imageField(product.image),
      }))
    );

    const doc = {
      _id: `umkmItem-${umkm.slug}`,
      _type: "umkmItem",
      name: umkm.name,
      slug: { _type: "slug", current: umkm.slug },
      category: umkm.category,
      image: await imageField(umkm.image),
      cardDescription: umkm.cardDescription,
      description: umkm.description,
      location: umkm.location,
      owner: umkm.owner,
      whatsapp: umkm.whatsapp,
      shopee: umkm.shopee,
      gallery,
      products,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${umkm.name}`);
  }
}

function paragraphsToBlocks(paragraphs: string[]) {
  return paragraphs.map((paragraph, index) => ({
    _type: "block",
    _key: `p${index}`,
    style: "normal",
    children: [{ _type: "span", _key: `p${index}-span`, text: paragraph }],
  }));
}

// Snapshot of the koperasi content that was hardcoded before Sanity.
const koperasiData = [
  {
    routeKey: "transmigrasi",
    name: "Koperasi Transmigrasi",
    homeCardDescription:
      "Informasi koperasi dan pemberdayaan ekonomi masyarakat di kawasan Rempang Eco City.",
    pageDescription:
      "Koperasi yang mendukung kebutuhan ekonomi dan kesejahteraan masyarakat di Rempang Eco City.",
    heroImage: "/images/hero-kop-trans.png",
    about: [
      "Koperasi Transmigrasi menjadi salah satu pilar ekonomi masyarakat di Rempang Eco City. Koperasi ini berperan dalam menyediakan layanan kebutuhan pokok, membantu pengelolaan usaha masyarakat, serta menjadi wadah pelatihan dan pemberdayaan ekonomi warga.",
      "Berbagai program seperti akses kebutuhan konsumsi, pendampingan usaha, dan bantuan permodalan menjadi strategi utama untuk mendorong kesejahteraan masyarakat secara berkelanjutan.",
    ],
    yearFounded: "2018",
    memberCount: "245",
    structureImage: "/images/struktur-kop-trans.png",
    pengurus: [
      { name: "Yudo Pramono", role: "Staff Khusus Kementrans", image: "/images/ex-pic-staff.png" },
      { name: "Yudo Pramono", role: "Staff Khusus Kementrans", image: "/images/ex-pic-staff.png" },
      { name: "Yudo Pramono", role: "Staff Khusus Kementrans", image: "/images/ex-pic-staff.png" },
      { name: "Yudo Pramono", role: "Staff Khusus Kementrans", image: "/images/ex-pic-staff.png" },
    ],
    galleryItems: [
      {
        title: "Pelatihan UMKM",
        description: "Peningkatan kapasitas produksi dan pemasaran produk lokal masyarakat Rempang.",
        images: ["/images/hero-kop-trans.png", "/images/hero-kops-mp.png"],
      },
      {
        title: "Kegiatan Ekonomi Komunitas",
        description: "Kolaborasi pengelolaan usaha dan distribusi kebutuhan masyarakat di sekitar kawasan.",
        images: ["/images/hero-kops-mp.png", "/images/hero-rumah-rempang.png"],
      },
      {
        title: "Kunjungan dan Pendampingan",
        description: "Pendampingan langsung untuk membangun sinergi antara koperasi, warga, dan mitra usaha.",
        images: ["/images/hero-rumah-rempang.png", "/images/hero-pariwisata-rec.jpg"],
      },
      {
        title: "Wisata dan Potensi Lokal",
        description: "Integrasi program ekonomi dengan potensi wisata dan budaya lokal untuk kesejahteraan bersama.",
        images: ["/images/hero-pariwisata-rec.jpg", "/images/hero-kop-trans.png"],
      },
      {
        title: "Produk Lokal",
        description: "Pameran produk khas serta penguatan branding dan distribusi hasil usaha warga.",
        images: ["/images/hero-kop-trans.png", "/images/hero-kops-mp.png"],
      },
      {
        title: "Pemberdayaan Warga",
        description: "Program pendampingan masyarakat untuk membangun usaha mandiri dan lingkungan yang produktif.",
        images: ["/images/hero-kops-mp.png", "/images/hero-rumah-rempang.png"],
      },
    ],
  },
  {
    routeKey: "merah-putih",
    name: "Koperasi Merah Putih",
    homeCardDescription:
      "Temukan potensi wisata dan destinasi ekonomi yang menjadi pilar kesejahteraan masyarakat Rempang.",
    pageDescription:
      "Koperasi yang mendorong potensi usaha dan kesejahteraan masyarakat Rempang Eco City.",
    heroImage: "/images/hero-kops-mp.png",
    about: [
      "Koperasi Merah Putih menjadi wadah ekonomi masyarakat Rempang yang fokus pada penguatan usaha, pelayanan kebutuhan pokok, hingga pengembangan potensi lokal. Koperasi ini hadir untuk mendorong kemandirian ekonomi masyarakat secara berkelanjutan.",
      "Dengan orientasi pada semangat gotong royong, koperasi ini aktif dalam program pengelolaan usaha, dukungan modal usaha, serta pemberdayaan UMKM lokal agar lebih kompetitif dan berdampak luas.",
    ],
    yearFounded: "2020",
    memberCount: "180",
    structureImage: "/images/struktur-kop-trans.png",
    pengurus: [
      { name: "Yudo Pramono", role: "Staff Khusus Kementrans", image: "/images/ex-pic-staff.png" },
      { name: "Yudo Pramono", role: "Staff Khusus Kementrans", image: "/images/ex-pic-staff.png" },
      { name: "Yudo Pramono", role: "Staff Khusus Kementrans", image: "/images/ex-pic-staff.png" },
      { name: "Yudo Pramono", role: "Staff Khusus Kementrans", image: "/images/ex-pic-staff.png" },
    ],
    galleryItems: [
      {
        title: "Pelatihan UMKM",
        description: "Peningkatan kapasitas produksi dan pemasaran produk lokal masyarakat Rempang.",
        images: ["/images/hero-kops-mp.png", "/images/hero-kop-trans.png"],
      },
      {
        title: "Program Komunitas",
        description: "Pemberdayaan masyarakat melalui pembinaan usaha dan dukungan kerjasama lokal.",
        images: ["/images/hero-kop-trans.png", "/images/hero-rumah-rempang.png"],
      },
      {
        title: "Kunjungan dan Pendampingan",
        description: "Pendampingan usaha dan pembinaan operasional untuk mendorong kemandirian ekonomi.",
        images: ["/images/hero-rumah-rempang.png", "/images/hero-pariwisata-rec.jpg"],
      },
      {
        title: "Potensi Lokal dan Wisata",
        description: "Integrasi kegiatan ekonomi dengan sumber daya lokal dan potensi wisata masyarakat.",
        images: ["/images/hero-pariwisata-rec.jpg", "/images/hero-kops-mp.png"],
      },
    ],
  },
];

// Snapshot of the pariwisata content that was hardcoded before Sanity.
const pariwisataData = [
  {
    routeKey: "mancing",
    name: "Wisata Mancing Rempang",
    location: "Pesisir Timur Rempang",
    category: "Jasa",
    summary:
      "Nikmati pengalaman memancing bersama nelayan lokal dengan spot laut terbuka dan perairan dangkal.",
    description:
      "Wisata Mancing Rempang menghadirkan pengalaman trip memancing yang cocok untuk pemula hingga hobiis. Pengunjung dapat memilih trip pagi atau sore dengan opsi sewa perahu, perlengkapan dasar, dan pemandu lokal.",
    bestTime: "Pukul 05.30 - 09.30 atau 15.30 - 18.30",
    facilities: ["Sewa perahu", "Pemandu lokal", "Paket umpan", "Area istirahat"],
    tips: [
      "Gunakan sunblock dan topi saat trip pagi.",
      "Pilih trip sore untuk cuaca lebih teduh.",
      "Reservasi minimal H-1 untuk grup.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516939884455-1445c8652f83?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545816250-e12bedba42ba?q=80&w=1200&auto=format&fit=crop",
    ],
    whatsapp: "https://wa.me/6281234567871",
  },
  {
    routeKey: "mangrove",
    name: "Eksplorasi Mangrove Rempang",
    location: "Pesisir Rempang",
    category: "Alam",
    summary:
      "Susuri jalur mangrove dengan perahu kecil sambil mengenal ekosistem pesisir Rempang.",
    description:
      "Eksplorasi Mangrove Rempang menawarkan wisata alam edukatif yang ramah keluarga. Pengunjung dapat menikmati jalur tracking, naik perahu, hingga sesi edukasi konservasi bersama komunitas setempat.",
    bestTime: "Pukul 07.00 - 10.00 atau 16.00 - 18.00",
    facilities: ["Dermaga kecil", "Perahu susur", "Pemandu edukasi", "Spot foto"],
    tips: [
      "Gunakan alas kaki yang nyaman untuk jalur kayu.",
      "Bawa air minum sendiri untuk perjalanan.",
      "Datang saat sore untuk cahaya foto terbaik.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?q=80&w=1200&auto=format&fit=crop",
    ],
    whatsapp: "https://wa.me/6281234567872",
  },
];

async function migrateKoperasi() {
  console.log(`\nMigrating ${koperasiData.length} koperasi...`);

  for (const koperasi of koperasiData) {
    const pengurus = await Promise.all(
      koperasi.pengurus.map(async (person, index) => ({
        _type: "koperasiPengurus" as const,
        _key: `pengurus-${index}`,
        name: person.name,
        role: person.role,
        image: await imageField(person.image),
      }))
    );

    const galleryItems = await Promise.all(
      koperasi.galleryItems.map(async (item, index) => ({
        _type: "koperasiGalleryItem" as const,
        _key: `gallery-${index}`,
        title: item.title,
        description: item.description,
        images: await Promise.all(
          item.images.map(async (imagePath, imgIndex) => ({
            _type: "image" as const,
            _key: `gallery-${index}-${imgIndex}`,
            asset: await uploadImage(imagePath),
          }))
        ),
      }))
    );

    const doc = {
      _id: `koperasi-${koperasi.routeKey}`,
      _type: "koperasi",
      name: koperasi.name,
      routeKey: koperasi.routeKey,
      homeCardDescription: koperasi.homeCardDescription,
      pageDescription: koperasi.pageDescription,
      heroImage: await imageField(koperasi.heroImage),
      about: paragraphsToBlocks(koperasi.about),
      yearFounded: koperasi.yearFounded,
      memberCount: koperasi.memberCount,
      structureImage: await imageField(koperasi.structureImage),
      pengurus,
      galleryItems,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${koperasi.name}`);
  }
}

async function migratePariwisata() {
  console.log(`\nMigrating ${pariwisataData.length} pariwisata destinations...`);

  for (const destination of pariwisataData) {
    const gallery = await Promise.all(
      destination.gallery.map(async (imagePath, index) => ({
        _type: "image" as const,
        _key: `gallery-${index}`,
        asset: await uploadImage(imagePath),
      }))
    );

    const doc = {
      _id: `pariwisataDestination-${destination.routeKey}`,
      _type: "pariwisataDestination",
      routeKey: destination.routeKey,
      name: destination.name,
      location: destination.location,
      category: destination.category,
      summary: destination.summary,
      description: destination.description,
      bestTime: destination.bestTime,
      facilities: destination.facilities,
      tips: destination.tips,
      gallery,
      whatsapp: destination.whatsapp,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${destination.name}`);
  }
}

// Snapshot of the profil page content that was hardcoded before Sanity.
const profilData = {
  headerTitle: "Profil Rempang Eco City",
  headerDescription: "Informasi lengkap tentang Rempang Eco City",
  aboutTitle: "Tentang Rempang Eco City",
  aboutImage: "/images/about-profil-rec.png",
  aboutBody: [
    "Rempang Eco City merupakan kawasan pengembangan strategis yang berlokasi di Pulau Rempang, Batam, Kepulauan Riau, Indonesia. Kawasan ini dikembangkan dengan visi untuk menciptakan ekosistem terintegrasi yang menghubungkan lima pilar pembangunan utama.",
    "Pengembangan Rempang Eco City dilakukan dengan mempertimbangkan tiga prinsip utama: keberlanjutan lingkungan, pemberdayaan masyarakat lokal, dan pertumbuhan ekonomi jangka panjang yang berkelanjutan.",
    "Proyek ini melibatkan kolaborasi antara pemerintah, masyarakat lokal, dan sektor swasta untuk memastikan pembangunan yang inklusif dan berkelanjutan.",
  ],
  lembagaTitle: "Lembaga Kemasyarakatan",
  lembagaDescription: "Struktur organisasi kemasyarakatan di Rempang Eco City.",
  lembagaItems: [
    { title: "RW 01", description: "Pengurus RW dan komunitas lokal", image: "/images/ex-pic-staff.png" },
    { title: "RW 02", description: "Pengurus RW dan komunitas lokal", image: "/images/hero-kop-trans.png" },
    { title: "RW 03", description: "Pengurus RW dan komunitas lokal", image: "/images/hero-pariwisata-rec.jpg" },
    { title: "Lurah", description: "Kepala wilayah setempat", image: "/images/hero-rumah-rempang.png" },
  ],
  demografiTitle: "Demografi Penduduk",
  demografiDescription: "Data demografi Rempang Eco City (Mock Data)",
  demografiStats: [
    { label: "Total Penduduk", value: "12,450" },
    { label: "Jumlah KK", value: "3,200" },
    { label: "Laki-laki", value: "6,100" },
    { label: "Perempuan", value: "6,350" },
  ],
  demografiNote:
    "Data di atas adalah data placeholder untuk tujuan demonstrasi. Data aktual akan diperbarui secara berkala.",
};

async function migrateProfil() {
  console.log("\nMigrating profil page...");

  const lembagaItems = await Promise.all(
    profilData.lembagaItems.map(async (item, index) => ({
      _type: "lembagaItem" as const,
      _key: `lembaga-${index}`,
      title: item.title,
      description: item.description,
      image: await imageField(item.image),
    }))
  );

  const doc = {
    // Fixed _id: the Studio edits this singleton by id (sanity/structure.ts).
    _id: "profilPage",
    _type: "profilPage",
    headerTitle: profilData.headerTitle,
    headerDescription: profilData.headerDescription,
    aboutTitle: profilData.aboutTitle,
    aboutImage: await imageField(profilData.aboutImage),
    aboutBody: paragraphsToBlocks(profilData.aboutBody),
    lembagaTitle: profilData.lembagaTitle,
    lembagaDescription: profilData.lembagaDescription,
    lembagaItems,
    demografiTitle: profilData.demografiTitle,
    demografiDescription: profilData.demografiDescription,
    demografiStats: profilData.demografiStats.map((stat, index) => ({
      _type: "demografiStat" as const,
      _key: `stat-${index}`,
      ...stat,
    })),
    demografiNote: profilData.demografiNote,
  };

  await client.createOrReplace(doc);
  console.log("  ✓ Halaman Profil");
}

// Snapshot of the homepage copy that was hardcoded before Sanity.
const berandaData = {
  heroTitle: "Selamat Datang di\nRempang Eco City",
  heroDescription:
    "Portal informasi masyarakat Rempang Eco City yang menghadirkan informasi seputar profil wilayah, koperasi, pariwisata, UMKM, dan berita terkini.",
  heroButtonLabel: "Kenali Rempang Eco City",
  heroButtonLink: "/profil",
  heroImage: "/images/hero-rumah-rempang.png",
  petaTitle: "Jelajahi Wilayah Rempang",
  petaDescription: "Lihat lokasi dan wilayah Rempang Eco City",
  petaAddress:
    "R67F+PW2 Rempang Eco City Tanjung Banun, Sembulang, Galang, Batam City, Riau Islands 29481",
  koperasiTitle: "Koperasi",
  pariwisataTitle: "Pariwisata",
  pariwisataDescription:
    "Jelajahi potensi alam dan budaya di Rempang — destinasi pantai, komunitas pesisir, serta kegiatan wisata yang mendukung ekonomi lokal. Temukan rute, spot foto, dan layanan wisata setempat.",
  pariwisataImages: [
    "/images/hero-pariwisata-rec.jpg",
    "/images/hero-rumah-rempang.png",
    "/images/hero-kop-trans.png",
  ],
  umkmTitle: "Usaha Mikro, Kecil, dan Menengah",
  umkmDescription:
    "UMKM di Rempang Eco City menjadi penggerak ekonomi lokal melalui ragam usaha kuliner, kerajinan, dan jasa. Program pemberdayaan difokuskan pada peningkatan kualitas produk, akses pasar, serta penguatan kapasitas pelaku usaha agar semakin berdaya saing.",
  beritaTitle: "Berita Terbaru",
};

async function migrateBeranda() {
  console.log("\nMigrating beranda page...");

  const { heroImage, pariwisataImages, ...copy } = berandaData;

  const doc = {
    // Fixed _id: the Studio edits this singleton by id (sanity/structure.ts).
    _id: "berandaPage",
    _type: "berandaPage",
    ...copy,
    heroImage: await imageField(heroImage),
    pariwisataImages: await Promise.all(
      pariwisataImages.map(async (imagePath, index) => ({
        _type: "image" as const,
        _key: `pariwisata-${index}`,
        asset: await uploadImage(imagePath),
      }))
    ),
  };

  await client.createOrReplace(doc);
  console.log("  ✓ Halaman Beranda");
}

const SECTIONS = {
  news: migrateNewsArticles,
  umkm: migrateUmkmCatalog,
  koperasi: migrateKoperasi,
  pariwisata: migratePariwisata,
  profil: migrateProfil,
  beranda: migrateBeranda,
} as const;

type Section = keyof typeof SECTIONS;

function parseSections(): Section[] {
  const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
  // Required on purpose: running every section by accident would overwrite
  // (or, for docs created in the Studio with random _ids, duplicate) content.
  if (!onlyArg) {
    throw new Error(
      `Pass --only=<sections>. Valid: ${Object.keys(SECTIONS).join(", ")}`
    );
  }

  const requested = onlyArg.slice("--only=".length).split(",").filter(Boolean);
  const unknown = requested.filter((name) => !(name in SECTIONS));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown section(s): ${unknown.join(", ")}. Valid: ${Object.keys(SECTIONS).join(", ")}`
    );
  }
  return requested as Section[];
}

async function main() {
  const sections = parseSections();
  console.log(
    `Migrating [${sections.join(", ")}] to Sanity project "${projectId}" (dataset: ${dataset})`
  );

  for (const section of sections) {
    await SECTIONS[section]();
  }

  console.log("\nMigration complete. Verify content in /studio.");
}

main().catch((error) => {
  console.error("\nMigration failed:", error);
  process.exit(1);
});
