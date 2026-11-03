import { defineField, defineType } from "sanity";

// Only two cooperatives exist today, each with its own static route
// (/koperasi/transmigrasi and /koperasi/merah-putih). routeKey ties a
// document to its page deterministically instead of a free-text slug.
const ROUTE_KEYS = ["transmigrasi", "merah-putih"] as const;

export const koperasi = defineType({
  name: "koperasi",
  title: "Koperasi",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "tentang", title: "Tentang" },
    { name: "struktur", title: "Struktur & Pengurus" },
    { name: "keanggotaan", title: "Keanggotaan" },
    { name: "fasilitas", title: "Fasilitas" },
    { name: "layanan", title: "Layanan" },
    { name: "perikanan", title: "Hasil Perikanan" },
    { name: "galeri", title: "Galeri Kegiatan" },
    { name: "laporan", title: "Laporan Keuangan" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nama Koperasi",
      group: "header",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "routeKey",
      title: "Halaman Tujuan",
      group: "header",
      type: "string",
      description: "Menentukan halaman /koperasi/... mana yang menampilkan dokumen ini.",
      options: { list: [...ROUTE_KEYS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "homeCardDescription",
      title: "Deskripsi Singkat (untuk card Beranda)",
      group: "header",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "pageDescription",
      title: "Deskripsi Header Halaman",
      group: "header",
      type: "text",
      rows: 2,
      description:
        "Tampil di bawah judul halaman /koperasi/.... Jika kosong, memakai Deskripsi Singkat.",
    }),
    defineField({
      name: "heroImage",
      title: "Foto Utama",
      group: "tentang",
      type: "image",
      options: { hotspot: true },
      description: "Dipakai di card Beranda maupun bagian Tentang.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "about",
      title: "Deskripsi Tentang",
      group: "tentang",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "yearFounded",
      title: "Tahun Berdiri",
      group: "tentang",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "memberCount",
      title: "Jumlah Anggota",
      group: "tentang",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "struktur",
      title: "Struktur Kepengurusan",
      group: "struktur",
      type: "strukturOrganisasi",
      description: "Bagan dibuat otomatis dari isian ini. Jika ada pergantian pengurus, cukup ganti namanya.",
    }),
    defineField({
      name: "structureImage",
      title: "Gambar Struktur Kepengurusan (cadangan)",
      group: "struktur",
      type: "image",
      options: { hotspot: true },
      description: "Hanya dipakai jika Struktur Kepengurusan di atas kosong.",
    }),
    defineField({
      name: "pengurus",
      title: "Pengurus",
      group: "struktur",
      description: "Foto pengurus, tampil setelah bagan struktur.",
      type: "array",
      of: [{ type: "koperasiPengurus" }],
    }),
    defineField({
      name: "membershipTitle",
      title: "Judul Ajakan",
      type: "string",
      group: "keanggotaan",
      description: 'Kosongkan untuk memakai "Jadi Anggota <Nama Koperasi>".',
    }),
    defineField({
      name: "membershipDescription",
      title: "Deskripsi Keanggotaan",
      type: "text",
      rows: 3,
      group: "keanggotaan",
      description: "Ajakan singkat di bawah judul.",
    }),
    defineField({
      name: "membershipSyarat",
      title: "Syarat (opsional)",
      type: "text",
      rows: 3,
      group: "keanggotaan",
      description: "Tampil sebagai kartu Syarat di sebelah kanan. Kosongkan untuk menyembunyikan kartu.",
    }),
    defineField({
      name: "membershipManfaat",
      title: "Manfaat (opsional)",
      type: "text",
      rows: 3,
      group: "keanggotaan",
      description: "Tampil sebagai kartu Manfaat di sebelah kanan. Kosongkan untuk menyembunyikan kartu.",
    }),
    defineField({
      name: "membershipWhatsapp",
      title: "Link WhatsApp Pendaftaran",
      type: "url",
      group: "keanggotaan",
      description:
        'Format: https://wa.me/628xxxxxxxxxx. Section Keanggotaan hanya tampil jika link ini diisi.',
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "fasilitas",
      title: "Fasilitas",
      group: "fasilitas",
      type: "array",
      of: [{ type: "koperasiFasilitas" }],
      description: "Tampil sebelum Galeri. Section disembunyikan jika kosong.",
    }),
    defineField({
      name: "layanan",
      title: "Layanan",
      group: "layanan",
      type: "array",
      of: [{ type: "koperasiLayanan" }],
      description: "Tampil sebelum Galeri. Section disembunyikan jika kosong.",
    }),
    defineField({
      name: "perikananDescription",
      title: "Deskripsi",
      type: "text",
      rows: 2,
      group: "perikanan",
      description:
        "Kalimat pembuka di bawah judul section (opsional). Section Hasil Perikanan disembunyikan jika angka, produk, dan testimoni semuanya kosong.",
    }),
    defineField({
      name: "perikananWhatsapp",
      title: "Link WhatsApp Pemesanan",
      type: "url",
      group: "perikanan",
      description:
        'Format: https://wa.me/628xxxxxxxxxx. Satu nomor untuk semua produk; kotak "Pesan via WhatsApp" di bawah katalog hanya tampil jika link ini diisi.',
      validation: (rule) =>
        rule
          .uri({ scheme: ["https"] })
          .custom((url) =>
            !url || /^https:\/\/wa\.me\/\d{8,15}$/.test(url)
              ? true
              : "Gunakan format https://wa.me/628xxxxxxxxxx (tanpa spasi, tanda + atau tanda hubung)."
          ),
    }),
    defineField({
      name: "perikananOrderTitle",
      title: "Judul Kotak Pemesanan",
      type: "string",
      group: "perikanan",
      description: "Judul kotak di bawah katalog produk.",
      initialValue: "Pesan hasil perikanan",
    }),
    defineField({
      name: "perikananOrderDescription",
      title: "Deskripsi Kotak Pemesanan",
      type: "text",
      rows: 2,
      group: "perikanan",
      description: "Penjelasan singkat cara memesan, di bawah judul kotak.",
    }),
    defineField({
      name: "perikananStats",
      title: "Angka Penjualan",
      type: "array",
      group: "perikanan",
      description: 'Contoh: "2,5 ton" + "Ikan terjual". Disarankan 3 item.',
      validation: (rule) => rule.max(4),
      of: [
        {
          type: "object",
          name: "perikananStat",
          title: "Angka",
          fields: [
            defineField({
              name: "value",
              title: "Nilai",
              type: "string",
              description: 'Contoh: "2,5 ton", "120+"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'Contoh: "Ikan terjual", "Pembeli", "Nelayan mitra"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "perikananProduk",
      title: "Katalog Produk",
      type: "array",
      group: "perikanan",
      of: [{ type: "koperasiProdukIkan" }],
    }),
    defineField({
      name: "perikananTestimoni",
      title: "Testimoni Pembeli",
      type: "array",
      group: "perikanan",
      of: [{ type: "koperasiTestimoni" }],
    }),
    defineField({
      name: "galleryItems",
      title: "Galeri Kegiatan",
      group: "galeri",
      type: "array",
      of: [{ type: "koperasiGalleryItem" }],
    }),
    defineField({
      name: "laporanKeuangan",
      title: "Laporan Keuangan",
      group: "laporan",
      type: "array",
      of: [{ type: "koperasiLaporanKeuangan" }],
      description: "Tampil setelah Galeri. Section disembunyikan jika kosong.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "routeKey", media: "heroImage" },
  },
});
