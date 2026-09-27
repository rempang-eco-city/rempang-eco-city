import type { StructureResolver } from "sanity/structure";

// Document types that must only ever have one document. Each is edited at
// _id === its type name, and listed at the top of the Studio in this order.
const SINGLETONS = [
  { type: "berandaPage", title: "Halaman Beranda" },
  { type: "profilPage", title: "Halaman Profil" },
];

export const SINGLETON_TYPES = new Set(SINGLETONS.map(({ type }) => type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      ...SINGLETONS.map(({ type, title }) =>
        S.listItem()
          .title(title)
          .id(type)
          .child(S.document().schemaType(type).documentId(type).title(title))
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? "")
      ),
    ]);
