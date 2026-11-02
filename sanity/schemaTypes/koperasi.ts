import { defineField, defineType } from "sanity";

// Only two cooperatives exist today, each with its own static route
// (/koperasi/transmigrasi and /koperasi/merah-putih). routeKey ties a
// document to its page deterministically instead of a free-text slug.
const ROUTE_KEYS = ["transmigrasi", "merah-putih"] as const;

export const koperasi = defineType({
  name: "koperasi",
  title: "Koperasi",
  type: "document",
  fieldsets: [
    {
      name: "keanggotaan",
      title: "Keanggotaan",
      description: "Section ajakan menjadi anggota, tampil setelah foto pengurus.",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "perikanan",
      title: "Hasil Perikanan",
      description:
        "Section etalase hasil tangkapan, tampil setelah Layanan. Disembunyikan jika angka, produk, dan testimoni semuanya kosong.",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nama Koperasi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "routeKey",
      title: "Halaman Tujuan",
      type: "string",
      description: "Menentukan halaman /koperasi/... mana yang menampilkan dokumen ini.",
      options: { list: [...ROUTE_KEYS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "homeCardDescription",
      title: "Deskripsi Singkat (untuk card Beranda)",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "pageDescription",
      title: "Deskripsi Header Halaman",
      type: "text",
      rows: 2,
      description:
        "Tampil di bawah judul halaman /koperasi/.... Jika kosong, memakai Deskripsi Singkat.",
    }),
    defineField({
      name: "heroImage",
      title: "Foto Utama",
      type: "image",
      options: { hotspot: true },
      description: "Dipakai di card Beranda maupun bagian Tentang.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "about",
      title: "Deskripsi Tentang",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "yearFounded",
      title: "Tahun Berdiri",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "memberCount",
      title: "Jumlah Anggota",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "struktur",
      title: "Struktur Kepengurusan",
      type: "strukturOrganisasi",
      description: "Bagan dibuat otomatis dari isian ini. Jika ada pergantian pengurus, cukup ganti namanya.",
    }),
    defineField({
      name: "structureImage",
      title: "Gambar Struktur Kepengurusan (cadangan)",
      type: "image",
      options: { hotspot: true },
      description: "Hanya dipakai jika Struktur Kepengurusan di atas kosong.",
    }),
    defineField({
      name: "pengurus",
      title: "Pengurus",
      type: "array",
      of: [{ type: "koperasiPengurus" }],
    }),
    defineField({
      name: "membershipTitle",
      title: "Judul Ajakan",
      type: "string",
      fieldset: "keanggotaan",
      description: 'Kosongkan untuk memakai "Jadi Anggota <Nama Koperasi>".',
    }),
    defineField({
      name: "membershipDescription",
      title: "Deskripsi Keanggotaan",
      type: "text",
      rows: 3,
      fieldset: "keanggotaan",
      description: "Ajakan singkat di bawah judul.",
    }),
    defineField({
      name: "membershipSyarat",
      title: "Syarat (opsional)",
      type: "text",
      rows: 3,
      fieldset: "keanggotaan",
      description: "Tampil sebagai kartu Syarat di sebelah kanan. Kosongkan untuk menyembunyikan kartu.",
    }),
    defineField({
      name: "membershipManfaat",
      title: "Manfaat (opsional)",
      type: "text",
      rows: 3,
      fieldset: "keanggotaan",
      description: "Tampil sebagai kartu Manfaat di sebelah kanan. Kosongkan untuk menyembunyikan kartu.",
    }),
    defineField({
      name: "membershipWhatsapp",
      title: "Link WhatsApp Pendaftaran",
      type: "url",
      fieldset: "keanggotaan",
      description:
        'Format: https://wa.me/628xxxxxxxxxx. Section Keanggotaan hanya tampil jika link ini diisi.',
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "fasilitas",
      title: "Fasilitas",
      type: "array",
      of: [{ type: "koperasiFasilitas" }],
      description: "Tampil sebelum Galeri. Section disembunyikan jika kosong.",
    }),
    defineField({
      name: "layanan",
      title: "Layanan",
      type: "array",
      of: [{ type: "koperasiLayanan" }],
      description: "Tampil sebelum Galeri. Section disembunyikan jika kosong.",
    }),
    defineField({
      name: "perikananDescription",
      title: "Deskripsi",
      type: "text",
      rows: 2,
      fieldset: "perikanan",
      description: "Kalimat pembuka di bawah judul section (opsional).",
    }),
    defineField({
      name: "perikananWhatsapp",
      title: "Link WhatsApp Pemesanan",
      type: "url",
      fieldset: "perikanan",
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
      name: "perikananStats",
      title: "Angka Penjualan",
      type: "array",
      fieldset: "perikanan",
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
      name: "perikananStatsNote",
      title: "Keterangan Angka (opsional)",
      type: "string",
      fieldset: "perikanan",
      description: 'Tampil di bawah angka. Contoh: "Data hingga Oktober 2026"',
    }),
    defineField({
      name: "perikananProduk",
      title: "Katalog Produk",
      type: "array",
      fieldset: "perikanan",
      of: [{ type: "koperasiProdukIkan" }],
    }),
    defineField({
      name: "perikananTestimoni",
      title: "Testimoni Pembeli",
      type: "array",
      fieldset: "perikanan",
      of: [{ type: "koperasiTestimoni" }],
    }),
    defineField({
      name: "galleryItems",
      title: "Galeri Kegiatan",
      type: "array",
      of: [{ type: "koperasiGalleryItem" }],
    }),
    defineField({
      name: "laporanKeuangan",
      title: "Laporan Keuangan",
      type: "array",
      of: [{ type: "koperasiLaporanKeuangan" }],
      description: "Tampil setelah Galeri. Section disembunyikan jika kosong.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "routeKey", media: "heroImage" },
  },
});
