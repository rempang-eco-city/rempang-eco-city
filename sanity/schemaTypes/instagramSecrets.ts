import { defineArrayMember, defineField, defineType } from "sanity";

// Instagram API access tokens for the Beranda feed. Stored at
// INSTAGRAM_SECRETS_ID: an _id containing "." is never served by the public
// API, so only the Studio and the server (with SANITY_API_TOKEN) can read it.
export const INSTAGRAM_SECRETS_ID = "secrets.instagram";

export const instagramSecrets = defineType({
  name: "instagramSecrets",
  title: "Token Instagram",
  type: "document",
  fields: [
    defineField({
      name: "tokens",
      title: "Token Akses",
      type: "array",
      description:
        "Satu token per akun untuk menampilkan postingan terbaru di Beranda. Token diperpanjang otomatis oleh website; isi ulang hanya jika feed akun berhenti tampil.",
      of: [
        defineArrayMember({
          name: "instagramToken",
          title: "Token",
          type: "object",
          fields: [
            defineField({
              name: "username",
              title: "Username",
              type: "string",
              description: 'Sama persis dengan username di Konten Halaman → Instagram, contoh: umkm.rec',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[A-Za-z0-9._]{1,30}$/, { name: "username Instagram" })
                  .error('Hanya huruf, angka, titik, dan "_" (tanpa "@" atau link).'),
            }),
            defineField({
              name: "token",
              title: "Access Token",
              type: "string",
              description: "Dari Meta for Developers → Instagram → API setup → Generate token.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "refreshedAt",
              title: "Terakhir Diperpanjang",
              type: "datetime",
              readOnly: true,
              description: "Diisi otomatis oleh website.",
            }),
          ],
          preview: {
            select: { username: "username", refreshedAt: "refreshedAt" },
            prepare: ({ username, refreshedAt }) => ({
              title: username ? `@${username}` : "Token",
              subtitle: refreshedAt
                ? `Diperpanjang ${new Date(refreshedAt).toLocaleDateString("id-ID")}`
                : "Belum pernah diperpanjang",
            }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Token Instagram" }) },
});
