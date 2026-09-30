import { defineField, defineType } from "sanity";
import { LAYANAN_ICON_OPTIONS } from "../../../lib/layananIcons";

export const koperasiLayanan = defineType({
  name: "koperasiLayanan",
  title: "Layanan",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Nama Layanan",
      type: "string",
      description: 'Contoh: "Simpan Pinjam"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Ikon",
      type: "string",
      options: { list: LAYANAN_ICON_OPTIONS.map(({ value, title }) => ({ value, title })) },
      initialValue: "lainnya",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "highlights",
      title: "Poin Keunggulan (opsional)",
      type: "array",
      of: [{ type: "string" }],
      description: "Poin singkat yang tampil dengan tanda centang. Disarankan maksimal 4.",
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
