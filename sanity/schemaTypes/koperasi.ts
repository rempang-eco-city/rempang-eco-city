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
      name: "structureImage",
      title: "Gambar Struktur Kepengurusan",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pengurus",
      title: "Pengurus",
      type: "array",
      of: [{ type: "koperasiPengurus" }],
    }),
    defineField({
      name: "membershipDescription",
      title: "Deskripsi Keanggotaan",
      type: "text",
      rows: 3,
      fieldset: "keanggotaan",
      description: "Contoh: syarat, manfaat, atau cara menjadi anggota.",
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
