import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton: exactly one document with _id "pariwisataPage" (see sanity/structure.ts).
// Holds the Pokdarwis sections shown above the destinations on /pariwisata.
export const pariwisataPage = defineType({
  name: "pariwisataPage",
  title: "Halaman Pariwisata",
  type: "document",
  groups: [
    { name: "profil", title: "Profil Pokdarwis", default: true },
    { name: "struktur", title: "Struktur Organisasi" },
    { name: "pengurus", title: "Pengurus" },
  ],
  fields: [
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
      name: "penasehat",
      title: "Penasehat",
      type: "array",
      group: "struktur",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "ketua",
      title: "Ketua",
      type: "string",
      group: "struktur",
    }),
    defineField({
      name: "sekretaris",
      title: "Sekretaris",
      type: "string",
      group: "struktur",
    }),
    defineField({
      name: "bendahara",
      title: "Bendahara",
      type: "string",
      group: "struktur",
    }),
    defineField({
      name: "koordinatorBidang",
      title: "Koordinator Bidang",
      type: "string",
      group: "struktur",
    }),
    defineField({
      name: "bidang",
      title: "Bidang",
      type: "array",
      group: "struktur",
      of: [
        defineArrayMember({
          type: "object",
          name: "pokdarwisBidang",
          title: "Bidang",
          fields: [
            defineField({
              name: "name",
              title: "Nama Bidang",
              type: "string",
              description: 'Tanpa kata "Bidang". Contoh: "Humas & Pemasaran"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "penanggungJawab",
              title: "Penanggung Jawab",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "anggota",
              title: "Anggota",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
          preview: { select: { title: "name", subtitle: "penanggungJawab" } },
        }),
      ],
    }),

    defineField({
      name: "pengurus",
      title: "Pengurus",
      type: "array",
      group: "pengurus",
      description:
        'Ditampilkan sebagai deretan kartu yang bergerak. Pengurus tanpa foto tampil dengan kotak "Foto".',
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
  ],
  preview: {
    prepare: () => ({ title: "Halaman Pariwisata" }),
  },
});
