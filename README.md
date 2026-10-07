# Rempang Eco City

Portal informasi masyarakat Rempang Eco City: profil, koperasi, pariwisata, UMKM, dan berita.

Dibangun dengan Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, dan lucide-react. Konten dikelola lewat **Sanity CMS**, dan Studio-nya di-embed di `/studio`.

## Menjalankan project

1. Buat `.env.local`:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=...
   NEXT_PUBLIC_SANITY_DATASET=production
   # Hanya dibutuhkan untuk script migrasi (token dengan akses Editor)
   SANITY_API_TOKEN=...
   ```

2. Install dan jalankan:

   ```bash
   npm install
   npm run dev
   ```

3. Buka http://localhost:3000 untuk website, atau http://localhost:3000/studio untuk CMS.

## Struktur

| Folder | Isi |
|---|---|
| `app/` | Route App Router: `/`, `/profil`, `/koperasi`, `/koperasi/[routeKey]`, `/pariwisata`, `/umkm`, `/umkm/[slug]`, `/berita`, `/berita/[id]`, `/studio` |
| `components/sections/` | Section-section di Beranda |
| `components/pages/` | Isi utama tiap halaman (client component) |
| `components/` | Komponen bersama: Navbar, Footer, PageHeader |
| `lib/sanity/` | Sanity client dan semua query GROQ beserta tipe datanya (`queries.ts`) |
| `sanity/schemaTypes/` | Schema dokumen CMS |
| `sanity/structure.ts` | Susunan menu Studio (termasuk dokumen singleton) |
| `scripts/` | Script migrasi data awal ke Sanity |
| `data/umkmCatalog.ts` | Snapshot data UMKM lama, dipakai oleh script migrasi |

## Sumber konten

| Halaman | Sumber |
|---|---|
| Berita | Sanity, dokumen `newsArticle` |
| UMKM | Sanity, dokumen `umkmItem` |
| Koperasi | Sanity, dokumen `koperasi` (`routeKey`: `transmigrasi` / `merah-putih`) |
| Pariwisata | Sanity, dokumen singleton `pariwisataPage` (menu "Halaman Pariwisata"): header, profil Pokdarwis, gambar struktur, pengurus, dan daftar destinasi (`routeKey`: `mancing` / `mangrove` / `pulau`) |
| Profil | Sanity, dokumen singleton `profilPage` (menu "Halaman Profil" di Studio) |
| Beranda | Sanity, dokumen singleton `berandaPage` (menu "Halaman Beranda" di Studio) untuk teks, gambar, dan alamat peta tiap section. Card Koperasi, UMKM, dan Berita diambil dari dokumennya masing-masing |

Data di-cache dengan ISR selama 60 detik (`REVALIDATE_SECONDS` di `lib/sanity/queries.ts`), jadi perubahan di Studio akan muncul di website paling lama dalam 1 menit.

Berita diurutkan berdasarkan field **Tanggal Terbit** (`publishedAt`). Dokumen lama yang belum punya field ini tetap tampil memakai teks tanggal lamanya dan diurutkan berdasarkan waktu dokumen dibuat.

## Migrasi data ke Sanity

`npm run migrate:sanity` mengunggah konten awal (beserta gambarnya) ke Sanity. Script ini memakai `createOrReplace` dengan `_id` tetap, sehingga **menjalankannya ulang akan menimpa hasil edit di Studio** untuk dokumen yang sama. Batasi dengan `--only`:

```bash
npm run migrate:sanity -- --only=koperasi,profil
```

Pilihan section: `news`, `umkm`, `koperasi`, `profil`, `beranda`, dan `--only` wajib diisi. Dokumen yang dibuat lewat Studio punya `_id` acak, jadi memigrasi section yang isinya sudah diisi manual (saat ini `news` dan `umkm`) akan menghasilkan **duplikat**.
