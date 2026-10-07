import { defineField, defineType } from "sanity";

// routeKey drives which tab/icon is shown in the Pariwisata page's
// destination switcher (see DESTINATION_TABS in PariwisataContent).
const ROUTE_KEYS = ["mancing", "mangrove", "pulau"] as const;

export const pariwisataDestination = defineType({
  name: "pariwisataDestination",
  title: "Destinasi Pariwisata",
  type: "document",
  fields: [
    defineField({
      name: "routeKey",
      title: "Kunci Destinasi",
      type: "string",
      options: { list: [...ROUTE_KEYS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Nama Destinasi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tabLabel",
      title: "Label Tab (opsional)",
      type: "string",
      description:
        'Teks pada tombol pilihan destinasi. Contoh: "Pulau Mubut Darat". Jika kosong, memakai label bawaan sesuai Kunci Destinasi.',
    }),
    defineField({
      name: "location",
      title: "Lokasi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      description: 'Contoh: "Jasa", "Alam"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Ringkasan Singkat",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bestTime",
      title: "Waktu Terbaik Kunjungan (opsional)",
      type: "string",
    }),
    defineField({
      name: "facilities",
      title: "Fasilitas",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "tips",
      title: "Tips Kunjungan",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "packages",
      title: "Paket & Harga",
      type: "array",
      of: [{ type: "pariwisataPaket" }],
      description: 'Contoh: satu paket "Harga Turis" dan satu paket "Harga Lokal".',
    }),
    defineField({
      name: "gallery",
      title: "Galeri Foto & Video",
      type: "array",
      description:
        "Item pertama tampil sebagai media utama. Video: format MP4 (disarankan) atau WebM, usahakan di bawah 50 MB agar cepat dimuat.",
      of: [
        { type: "image", title: "Foto", options: { hotspot: true } },
        {
          type: "file",
          name: "video",
          title: "Video",
          options: { accept: "video/mp4,video/webm" },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "whatsapp",
      title: "Link WhatsApp",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "location", media: "gallery.0" },
  },
});
