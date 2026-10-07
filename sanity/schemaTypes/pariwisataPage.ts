import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton: exactly one document with _id "pariwisataPage" (see sanity/structure.ts).
// Holds everything on /pariwisata: header, Pokdarwis sections and destinations.
export const pariwisataPage = defineType({
  name: "pariwisataPage",
  title: "Halaman Pariwisata",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "profil", title: "Profil Pokdarwis" },
    { name: "struktur", title: "Struktur Organisasi" },
    { name: "pengurus", title: "Pengurus" },
    { name: "destinasi", title: "Destinasi Wisata" },
  ],
  fields: [
    defineField({
      name: "headerTitle",
      title: "Judul Halaman",
      type: "string",
      group: "header",
      initialValue: "Pariwisata Rempang Eco City",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headerDescription",
      title: "Subjudul Halaman",
      type: "text",
      rows: 2,
      group: "header",
    }),
    defineField({
      name: "groupName",
      title: "Nama Lengkap Kelompok",
      type: "string",
      group: "profil",
      description: 'Judul section Profil. Contoh: "Kelompok Sadar Wisata Lemak Manis"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortName",
      title: "Nama Singkat",
      type: "string",
      group: "profil",
      description:
        'Dipakai di judul "Struktur Organisasi …" dan "Pengurus …". Contoh: "Pokdarwis Lemak Manis"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stats",
      title: "Info Singkat",
      type: "array",
      group: "profil",
      description: "Kotak info di bawah judul. Disarankan 3 item.",
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "pokdarwisStat",
          title: "Info",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'Contoh: "Berdiri sejak"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Isi",
              type: "string",
              description: 'Contoh: "Juli 2026"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "array",
      group: "profil",
      of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }], lists: [] }],
    }),

    defineField({
      name: "structureImage",
      title: "Gambar Struktur Organisasi",
      type: "image",
      group: "struktur",
      options: { hotspot: true },
      description: "Bagan struktur organisasi dalam bentuk gambar (landscape).",
    }),

    defineField({
      name: "pengurus",
      title: "Pengurus",
      type: "array",
      group: "pengurus",
      description: 'Ditampilkan sebagai kartu foto. Pengurus tanpa foto tampil dengan kotak "Foto".',
      of: [
        defineArrayMember({
          type: "object",
          name: "pokdarwisPengurus",
          title: "Pengurus",
          fields: [
            defineField({
              name: "name",
              title: "Nama",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              title: "Jabatan",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "photo",
              title: "Foto (opsional)",
              type: "image",
              options: { hotspot: true },
              description: "Format JPG/PNG (bukan HEIC), potret.",
            }),
          ],
          preview: { select: { title: "name", subtitle: "role", media: "photo" } },
        }),
      ],
    }),
    defineField({
      name: "destinations",
      title: "Destinasi Wisata",
      type: "array",
      group: "destinasi",
      description: "Urutan di sini menentukan urutan tab di website. Seret untuk mengubah urutan.",
      of: [{ type: "pariwisataDestination" }],
      validation: (rule) =>
        rule.custom((destinations) => {
          const keys = (destinations ?? []).map((d) => (d as { routeKey?: string }).routeKey).filter(Boolean);
          const duplicate = keys.find((key, i) => keys.indexOf(key) !== i);
          return duplicate ? `Kunci Destinasi "${duplicate}" dipakai lebih dari sekali.` : true;
        }),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Halaman Pariwisata" }),
  },
});
