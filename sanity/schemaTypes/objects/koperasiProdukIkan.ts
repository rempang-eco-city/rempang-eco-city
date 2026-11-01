import { defineField, defineType } from "sanity";
import { PRODUK_STATUS_OPTIONS, PRODUK_UNIT_OPTIONS } from "../../../lib/perikanan";

export const koperasiProdukIkan = defineType({
  name: "koperasiProdukIkan",
  title: "Produk",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nama Produk",
      type: "string",
      description: 'Contoh: "Ikan Kakap Merah"',
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
    defineField({
      name: "status",
      title: "Ketersediaan",
      type: "string",
      options: { list: [...PRODUK_STATUS_OPTIONS], layout: "radio", direction: "horizontal" },
      initialValue: "tersedia",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Harga (opsional)",
      type: "number",
      description:
        'Angka saja, tanpa titik. Contoh: 65000. Kosongkan jika harga sering berubah; website akan menampilkan "Tanya harga via WhatsApp".',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "unit",
      title: "Satuan Harga",
      type: "string",
      options: { list: [...PRODUK_UNIT_OPTIONS], layout: "radio", direction: "horizontal" },
      initialValue: "kg",
      hidden: ({ parent }) => parent?.price == null,
    }),
    defineField({
      name: "note",
      title: "Keterangan Singkat (opsional)",
      type: "string",
      description: 'Contoh: "Minimal pembelian 5 kg"',
      validation: (rule) => rule.max(80),
    }),
  ],
  preview: {
    select: { title: "name", status: "status", price: "price", media: "image" },
    prepare: ({ title, status, price, media }) => ({
      title,
      subtitle: [
        PRODUK_STATUS_OPTIONS.find(({ value }) => value === status)?.title,
        price != null ? `Rp${Number(price).toLocaleString("id-ID")}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
