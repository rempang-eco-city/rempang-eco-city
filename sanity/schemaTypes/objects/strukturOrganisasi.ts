import { defineArrayMember, defineField, defineType } from "sanity";

// One box in the organisation chart: a title bar ("KETUA", "BIDANG PERIKANAN
// DAN KELAUTAN", ...) and the people in it. How the names are shown follows
// from the data (see components/StrukturOrganisasi.tsx):
// - one name without sub-jabatan → the name, centered
// - several names without sub-jabatan → a bullet list (e.g. Pengawas)
// - names with a sub-jabatan → "Manajer   Khairom" rows
export const strukturJabatan = defineType({
  name: "strukturJabatan",
  title: "Jabatan",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Nama Jabatan / Bidang",
      type: "string",
      description: 'Contoh: "Ketua" atau "Bidang Perikanan dan Kelautan". Tampil dengan huruf kapital.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "members",
      title: "Nama Pengurus",
      type: "array",
      of: [
        defineArrayMember({
          name: "anggota",
          title: "Pengurus",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Nama",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              title: "Sub-jabatan (opsional)",
              type: "string",
              description: 'Contoh: "Manajer" atau "Koordinator". Kosongkan jika tidak ada.',
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      first: "members.0.name",
      second: "members.1.name",
      third: "members.2.name",
    },
    prepare: ({ title, first, second, third }) => ({
      title,
      subtitle: [first, second, third].filter(Boolean).join(", "),
    }),
  },
});

// The whole chart. Each level is optional except Ketua; empty levels are
// simply left out of the drawing.
export const strukturOrganisasi = defineType({
  name: "strukturOrganisasi",
  title: "Struktur Organisasi",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "ketua",
      title: "1. Kotak Paling Atas",
      type: "strukturJabatan",
      description: 'Biasanya "Ketua".',
    }),
    defineField({
      name: "pengawas",
      title: "Kotak Samping (opsional)",
      type: "strukturJabatan",
      description: 'Tampil di sebelah kanan garis tengah, contoh "Pengawas".',
    }),
    defineField({
      name: "pengurusInti",
      title: "2. Baris Kedua",
      type: "array",
      of: [defineArrayMember({ type: "strukturJabatan" })],
      description: 'Contoh: "Sekretaris" dan "Bendahara". Maksimal 4.',
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "koordinator",
      title: "3. Kotak Tengah (opsional)",
      type: "strukturJabatan",
      description: 'Satu kotak di garis tengah sebelum baris bidang, contoh "Koordinator Bidang".',
    }),
    defineField({
      name: "bidang",
      title: "4. Baris Bidang",
      type: "array",
      of: [defineArrayMember({ type: "strukturJabatan" })],
      description: "Kotak-kotak di baris paling bawah. Maksimal 6.",
      validation: (rule) => rule.max(6),
    }),
  ],
  validation: (rule) =>
    rule.custom((value: ({ ketua?: { title?: string } } & Record<string, unknown>) | undefined) => {
      const hasContent =
        value && Object.entries(value).some(([key, field]) => !key.startsWith("_") && field);
      if (hasContent && !value?.ketua?.title) {
        return "Isi Kotak Paling Atas terlebih dahulu.";
      }
      return true;
    }),
});
