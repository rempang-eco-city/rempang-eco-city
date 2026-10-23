import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton: exactly one document with _id "berandaPage" (see sanity/structure.ts).
// Only the section copy lives here; the Koperasi, UMKM and Berita cards come
// from their own document types.
export const berandaPage = defineType({
  name: "berandaPage",
  title: "Halaman Beranda",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "peta", title: "Peta Wilayah" },
    { name: "koperasi", title: "Koperasi" },
    { name: "pariwisata", title: "Pariwisata" },
    { name: "umkm", title: "UMKM" },
    { name: "berita", title: "Berita" },
    { name: "instagram", title: "Instagram" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Judul Hero",
      type: "text",
      rows: 2,
      group: "hero",
      description: "Tekan Enter untuk pindah baris.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Deskripsi Hero",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "heroButtonLabel",
      title: "Teks Tombol",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroButtonLink",
      title: "Link Tombol",
      type: "url",
      group: "hero",
      description: 'Halaman di website ini (contoh: "/profil") atau link lengkap (https://...).',
      validation: (rule) =>
        rule.required().uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "heroImage",
      title: "Gambar Hero",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "petaTitle",
      title: "Judul Peta",
      type: "string",
      group: "peta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "petaDescription",
      title: "Deskripsi Peta",
      type: "text",
      rows: 2,
      group: "peta",
      description: 'Titik-titik di peta (warung, masjid, dll.) diisi di menu "Lokasi di Peta".',
    }),
    defineField({
      name: "petaAddress",
      title: "Alamat / Lokasi di Google Maps",
      type: "string",
      group: "peta",
      description:
        'Dipakai untuk tombol "Buka di Google Maps" di bawah peta. Bisa alamat atau Plus Code.',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "koperasiTitle",
      title: "Judul Section Koperasi",
      type: "string",
      group: "koperasi",
      description: "Card koperasi diambil dari dokumen Koperasi.",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "pariwisataTitle",
      title: "Judul Section Pariwisata",
      type: "string",
      group: "pariwisata",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pariwisataDescription",
      title: "Deskripsi Pariwisata",
      type: "text",
      rows: 3,
      group: "pariwisata",
    }),
    defineField({
      name: "pariwisataImages",
      title: "Foto Carousel Pariwisata",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      group: "pariwisata",
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: "umkmTitle",
      title: "Judul Section UMKM",
      type: "string",
      group: "umkm",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "umkmDescription",
      title: "Deskripsi UMKM",
      type: "text",
      rows: 3,
      group: "umkm",
      description: "Card UMKM diambil dari dokumen UMKM.",
    }),

    defineField({
      name: "beritaTitle",
      title: "Judul Section Berita",
      type: "string",
      group: "berita",
      description: "Card berita diambil dari dokumen Berita.",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "instagramTitle",
      title: "Judul Section Instagram",
      type: "string",
      group: "instagram",
      initialValue: "Ikuti Kami di Instagram",
    }),
    defineField({
      name: "instagramDescription",
      title: "Deskripsi Instagram",
      type: "text",
      rows: 2,
      group: "instagram",
    }),
    defineField({
      name: "instagramAccounts",
      title: "Akun Instagram",
      type: "array",
      group: "instagram",
      description: "Satu card per akun, paling bawah di Beranda. Kosongkan untuk menyembunyikan section.",
      of: [
        defineArrayMember({
          name: "instagramAccount",
          title: "Akun",
          type: "object",
          fields: [
            defineField({
              name: "username",
              title: "Username",
              type: "string",
              description: 'Tanpa "@" dan tanpa link, contoh: umkm.rec',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[A-Za-z0-9._]{1,30}$/, { name: "username Instagram" })
                  .error('Hanya huruf, angka, titik, dan "_" (tanpa "@" atau link).'),
            }),
            defineField({
              name: "photo",
              title: "Foto Profil (opsional)",
              type: "image",
              options: { hotspot: true },
              description:
                "Unggah foto profil akun ini (gambar persegi). Kosongkan untuk memakai logo Instagram.",
            }),
            defineField({
              name: "name",
              title: "Nama (opsional)",
              type: "string",
              description: 'Contoh: "UMKM Rempang Eco City". Kosongkan untuk hanya menampilkan @username.',
            }),
            defineField({
              name: "description",
              title: "Deskripsi Singkat (opsional)",
              type: "text",
              rows: 2,
              validation: (rule) => rule.max(140),
            }),
          ],
          preview: {
            select: { username: "username", name: "name", media: "photo" },
            prepare: ({ username, name, media }) => ({
              title: `@${username ?? ""}`,
              subtitle: name,
              media,
            }),
          },
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Halaman Beranda" }),
  },
});
