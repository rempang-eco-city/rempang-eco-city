import { defineField, defineType } from "sanity";
import {
  PRODUK_KATEGORI_OPTIONS,
  PRODUK_STATUS_OPTIONS,
  PRODUK_UNIT_OPTIONS,
  formatHarga,
} from "../../../lib/perikanan";

export const koperasiProdukIkan = defineType({
  name: "koperasiProdukIkan",
  title: "Produk",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nama Produk",
      type: "string",
      description: 'Contoh: "Belanak"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kategori",
      title: "Kategori",
      type: "string",
      options: { list: [...PRODUK_KATEGORI_OPTIONS], layout: "radio", direction: "horizontal" },
      initialValue: "lokal",
      description: "Ikan Lokal tampil di tabel harga; Ikan Ekspor tampil di daftar terpisah.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto (opsional)",
      type: "image",
      options: { hotspot: true },
      description: "Foto persegi paling cocok. Tanpa foto, ikon ikan ditampilkan.",
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
      title: "Harga Lokal (opsional)",
      type: "number",
      description:
        'Harga untuk warga REC. Angka saja, tanpa titik. Contoh: 60000. Untuk harga rentang (25.000–30.000), isi harga terendah di sini. Kosongkan jika harga sering berubah; website akan menampilkan "Tanya harga".',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "priceMax",
      title: "Harga Lokal Tertinggi (opsional)",
      type: "number",
      description: "Hanya untuk harga rentang. Contoh: 30000.",
      hidden: ({ parent }) => parent?.price == null,
      validation: (rule) =>
        rule
          .min(0)
          .integer()
          .custom((max, context) => {
            const price = (context.parent as { price?: number } | undefined)?.price;
            return max == null || price == null || max > price
              ? true
              : "Harga tertinggi harus lebih besar dari Harga Lokal.";
          }),
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
    select: { title: "name", kategori: "kategori", status: "status", price: "price", priceMax: "priceMax", media: "image" },
    prepare: ({ title, kategori, status, price, priceMax, media }) => ({
      title,
      subtitle: [
        PRODUK_KATEGORI_OPTIONS.find(({ value }) => value === kategori)?.title,
        PRODUK_STATUS_OPTIONS.find(({ value }) => value === status)?.title,
        formatHarga(price ?? undefined, priceMax ?? undefined),
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
