import { defineField, defineType } from "sanity";

// Header (title + subtitle) for pages whose content is a list of documents.
// Each is a singleton (see sanity/structure.ts), shown as "Header Halaman"
// next to the document list in the Studio.
function listingPageHeader(name: string, title: string) {
  return defineType({
    name,
    title,
    type: "document",
    fields: [
      defineField({
        name: "headerTitle",
        title: "Judul Halaman",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "headerDescription",
        title: "Subjudul Halaman",
        type: "text",
        rows: 2,
        description: "Juga dipakai sebagai deskripsi halaman di hasil pencarian Google.",
      }),
    ],
    preview: {
      prepare: () => ({ title }),
    },
  });
}

export const umkmPage = listingPageHeader("umkmPage", "Header Halaman UMKM");
export const beritaPage = listingPageHeader("beritaPage", "Header Halaman Berita");
