import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton: exactly one document with _id "profilPage" (see sanity/structure.ts).
export const profilPage = defineType({
  name: "profilPage",
  title: "Halaman Profil",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "about", title: "Tentang" },
    { name: "lembaga", title: "Lembaga Kemasyarakatan" },
    { name: "demografi", title: "Demografi" },
  ],
  fields: [
    defineField({
      name: "headerTitle",
      title: "Judul Halaman",
      type: "string",
      group: "header",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headerDescription",
      title: "Deskripsi Header",
      type: "text",
      rows: 2,
      group: "header",
    }),

    defineField({
      name: "aboutTitle",
      title: "Judul Bagian Tentang",
      type: "string",
      group: "about",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aboutImage",
      title: "Foto Tentang",
      type: "image",
      options: { hotspot: true },
      group: "about",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aboutBody",
      title: "Isi Tentang",
      type: "array",
      of: [{ type: "block" }],
      group: "about",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "lembagaTitle",
      title: "Judul Bagian Lembaga",
      type: "string",
      group: "lembaga",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lembagaDescription",
      title: "Deskripsi Bagian Lembaga",
      type: "text",
      rows: 2,
      group: "lembaga",
    }),
    defineField({
      name: "lembagaItems",
      title: "Daftar Lembaga",
      type: "array",
      group: "lembaga",
      of: [
        defineArrayMember({
          type: "object",
          name: "lembagaItem",
          title: "Lembaga",
          fields: [
            defineField({
              name: "title",
              title: "Nama",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Deskripsi",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Foto",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description", media: "image" },
          },
        }),
      ],
    }),

    defineField({
      name: "demografiTitle",
      title: "Judul Bagian Demografi",
      type: "string",
      group: "demografi",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "demografiDescription",
      title: "Deskripsi Bagian Demografi",
      type: "text",
      rows: 2,
      group: "demografi",
    }),
    defineField({
      name: "demografiStats",
      title: "Data Demografi",
      type: "array",
      group: "demografi",
      of: [
        defineArrayMember({
          type: "object",
          name: "demografiStat",
          title: "Data",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'Contoh: "Total Penduduk"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Nilai",
              type: "string",
              description: 'Contoh: "12.450"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({
      name: "demografiNote",
      title: "Catatan Demografi",
      type: "text",
      rows: 2,
      group: "demografi",
      description: "Tampil di kotak kuning di bawah data. Kosongkan untuk menyembunyikan.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Halaman Profil" }),
  },
});
