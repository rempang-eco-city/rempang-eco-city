import { defineArrayMember, defineField, defineType } from "sanity";

export const PAKET_UNITS = [
  { value: "orang", title: "Per orang (× jumlah peserta)" },
  { value: "jam", title: "Per jam (× durasi)" },
  { value: "paket", title: "Per paket / sekali bayar" },
] as const;

type PaketItem = { price?: number; unit?: (typeof PAKET_UNITS)[number]["value"] };
type Paket = { participants?: number; durationHours?: number; items?: PaketItem[] };

// Sum of the line items, using participants for "orang" and duration for "jam".
// Returns null when the package lacks the numbers needed to compute it.
export function computePaketTotal(paket: Paket): number | null {
  let total = 0;
  for (const item of paket.items ?? []) {
    if (typeof item.price !== "number") return null;
    if (item.unit === "orang") {
      if (!paket.participants) return null;
      total += item.price * paket.participants;
    } else if (item.unit === "jam") {
      if (!paket.durationHours) return null;
      total += item.price * paket.durationHours;
    } else {
      total += item.price;
    }
  }
  return total;
}

const rupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

export const pariwisataPaket = defineType({
  name: "pariwisataPaket",
  title: "Paket Harga",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label Harga",
      type: "string",
      description: 'Contoh: "Harga Turis" atau "Harga Lokal"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Nama Paket",
      type: "string",
      description: 'Contoh: "Trip Wisata Paket 10 Orang / 3 Jam"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "participants",
      title: "Jumlah Peserta",
      type: "number",
      description: 'Dipakai untuk menghitung item "per orang".',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: "durationHours",
      title: "Durasi (jam)",
      type: "number",
      description: 'Opsional. Dipakai untuk menghitung item "per jam".',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "items",
      title: "Rincian Biaya",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "pariwisataPaketItem",
          title: "Item",
          fields: [
            defineField({
              name: "name",
              title: "Nama Item",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Harga (Rp)",
              type: "number",
              description: "Angka saja, tanpa titik. Contoh: 20000",
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: "unit",
              title: "Satuan",
              type: "string",
              options: { list: [...PAKET_UNITS], layout: "radio" },
              initialValue: "orang",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "note",
              title: "Keterangan (opsional)",
              type: "string",
              description: 'Contoh: "Termasuk minyak, tekong dan ABK"',
            }),
          ],
          preview: {
            select: { title: "name", price: "price", unit: "unit" },
            prepare: ({ title, price, unit }) => ({
              title,
              subtitle:
                typeof price === "number"
                  ? `${rupiah(price)}${unit && unit !== "paket" ? ` / ${unit}` : ""}`
                  : undefined,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "total",
      title: "Total Akomodasi (Rp)",
      type: "number",
      description:
        "Angka resmi yang ditampilkan di website. Akan muncul peringatan jika berbeda dari hitungan rincian di atas.",
      validation: (rule) => [
        rule.required().min(0),
        rule
          .custom((total, context) => {
            if (typeof total !== "number") return true;
            const computed = computePaketTotal(context.parent as Paket);
            if (computed === null || computed === total) return true;
            return `Total berbeda dari hitungan rincian (${rupiah(computed)}). Periksa kembali angkanya.`;
          })
          .warning(),
      ],
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "title" },
  },
});
