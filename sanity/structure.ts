import type { StructureResolver } from "sanity/structure";

// Document types that must only ever have one document, keyed by _id.
export const SINGLETON_TYPES = new Set(["profilPage"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      S.listItem()
        .title("Halaman Profil")
        .id("profilPage")
        .child(
          S.document()
            .schemaType("profilPage")
            .documentId("profilPage")
            .title("Halaman Profil")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? "")
      ),
    ]);
