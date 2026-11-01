import { defineArrayMember, defineField, defineType } from "sanity";
import { MODUL_SEKTOR_OPTIONS } from "../../lib/modul";

// Singleton: exactly one document with _id "profilPage" (see sanity/structure.ts).
export const profilPage = defineType({
  name: "profilPage",
  title: "Halaman Profil",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "about", title: "Tentang" },
    { name: "lembaga", title: "Lembaga Kemasyarakatan" },
    { name: "fasilitas", title: "Fasilitas" },
    { name: "demografi", title: "Demografi" },
    { name: "modul", title: "Modul" },
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
      name: "fasilitasTitle",
      title: "Judul Bagian Fasilitas",
      type: "string",
      group: "fasilitas",
      initialValue: "Fasilitas REC",
    }),
    defineField({
      name: "fasilitasDescription",
      title: "Deskripsi Bagian Fasilitas",
      type: "text",
      rows: 2,
      group: "fasilitas",
    }),
    defineField({
      name: "fasilitasItems",
      title: "Daftar Fasilitas",
      type: "array",
      group: "fasilitas",
      description:
        "Ditampilkan sebagai deretan foto yang bergerak (marquee). Fasilitas tanpa foto tidak ditampilkan.",
      of: [
        defineArrayMember({
          type: "object",
          name: "fasilitasItem",
          title: "Fasilitas",
          fields: [
            defineField({
              name: "name",
              title: "Nama",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Foto",
              type: "image",
              options: { hotspot: true },
              description: "Foto landscape (rasio 4:3) paling cocok.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "name", media: "image" } },
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

    defineField({
      name: "modulTitle",
      title: "Judul Bagian Modul",
      type: "string",
      group: "modul",
      initialValue: "Modul",
    }),
    defineField({
      name: "modulDescription",
      title: "Deskripsi Bagian Modul",
      type: "text",
      rows: 2,
      group: "modul",
    }),
    defineField({
      name: "modulItems",
      title: "Daftar Modul",
      type: "array",
      group: "modul",
      description: "Tampil paling bawah di halaman Profil. Kosongkan untuk menyembunyikan bagian ini.",
      validation: (rule) => rule.max(6),
      of: [
        defineArrayMember({
          type: "object",
          name: "modulItem",
          title: "Modul",
          fields: [
            defineField({
              name: "title",
              title: "Judul",
              type: "string",
              description: 'Contoh: "Modul Pengembangan Pariwisata Berbasis Masyarakat"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "sektor",
              title: "Sektor",
              type: "string",
              options: { list: [...MODUL_SEKTOR_OPTIONS], layout: "radio", direction: "horizontal" },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "cover",
              title: "Cover (portrait)",
              type: "image",
              options: { hotspot: true },
              description: "Halaman pertama modul sebagai gambar, rasio kertas A4 (portrait).",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "file",
              title: "File PDF",
              type: "file",
              options: { accept: ".pdf" },
              description:
                "Kompres dulu jika lebih dari ±15 MB (misalnya Export \"Smallest file size\" di Canva) agar cepat dibuka di HP.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tahun",
              title: "Tahun (opsional)",
              type: "string",
              description: 'Contoh: "2026"',
            }),
          ],
          preview: {
            select: { title: "title", sektor: "sektor", media: "cover" },
            prepare: ({ title, sektor, media }) => ({
              title,
              subtitle: MODUL_SEKTOR_OPTIONS.find(({ value }) => value === sektor)?.title,
              media,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Halaman Profil" }),
  },
});
