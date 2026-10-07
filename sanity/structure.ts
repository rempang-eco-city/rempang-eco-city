import type { StructureResolver } from "sanity/structure";

// Studio sidebar, in the same order as the site's Navbar. A "singleton" opens
// its one document directly (edited at _id === type name); a "list" shows all
// documents of that type.
const MENU = [
  { kind: "singleton", type: "berandaPage", title: "Halaman Beranda" },
  { kind: "singleton", type: "profilPage", title: "Halaman Profil" },
  { kind: "list", type: "koperasi", title: "Halaman Koperasi" },
  { kind: "singleton", type: "pariwisataPage", title: "Halaman Pariwisata" },
  { kind: "list", type: "umkmItem", title: "Halaman UMKM" },
  { kind: "list", type: "newsArticle", title: "Halaman Berita" },
] as const;

export const SINGLETON_TYPES = new Set<string>(
  MENU.filter((item) => item.kind === "singleton").map(({ type }) => type)
);

const MENU_TYPES = new Set<string>(MENU.map(({ type }) => type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      ...MENU.map(({ kind, type, title }) =>
        kind === "singleton"
          ? S.listItem()
              .title(title)
              .id(type)
              .child(S.document().schemaType(type).documentId(type).title(title))
          : S.documentTypeListItem(type).title(title)
      ),
      // Safety net: any document type added later but not in MENU still shows up.
      ...S.documentTypeListItems().filter((item) => !MENU_TYPES.has(item.getId() ?? "")),
    ]);
