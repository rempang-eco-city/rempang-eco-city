import type { StructureResolver } from "sanity/structure";

// Studio sidebar, in the same order as the site's Navbar.
// - "singleton": opens its one document directly (edited at _id === type name)
// - "list": shows all documents of `type`
// - "listWithHeader": a folder with the page's header singleton and the list
type MenuItem =
  | { kind: "singleton"; type: string; title: string }
  | { kind: "list"; type: string; title: string }
  | { kind: "listWithHeader"; type: string; headerType: string; title: string; listTitle: string };

const MENU: MenuItem[] = [
  { kind: "singleton", type: "berandaPage", title: "Halaman Beranda" },
  { kind: "singleton", type: "profilPage", title: "Halaman Profil" },
  { kind: "list", type: "koperasi", title: "Halaman Koperasi" },
  { kind: "singleton", type: "pariwisataPage", title: "Halaman Pariwisata" },
  { kind: "listWithHeader", type: "umkmItem", headerType: "umkmPage", title: "Halaman UMKM", listTitle: "Daftar UMKM" },
  { kind: "listWithHeader", type: "newsArticle", headerType: "beritaPage", title: "Halaman Berita", listTitle: "Daftar Berita" },
];

export const SINGLETON_TYPES = new Set<string>(
  MENU.flatMap((item) =>
    item.kind === "singleton" ? [item.type] : item.kind === "listWithHeader" ? [item.headerType] : []
  )
);

const MENU_TYPES = new Set<string>([...MENU.map(({ type }) => type), ...SINGLETON_TYPES]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      ...MENU.map((item) => {
        const singleton = (type: string, title: string) =>
          S.listItem()
            .title(title)
            .id(type)
            .child(S.document().schemaType(type).documentId(type).title(title));

        if (item.kind === "singleton") return singleton(item.type, item.title);
        if (item.kind === "list") return S.documentTypeListItem(item.type).title(item.title);
        return S.listItem()
          .title(item.title)
          .id(`${item.type}-folder`)
          .child(
            S.list()
              .title(item.title)
              .items([
                singleton(item.headerType, "Header Halaman"),
                S.documentTypeListItem(item.type).title(item.listTitle),
              ])
          );
      }),
      // Safety net: any document type added later but not in MENU still shows up.
      ...S.documentTypeListItems().filter((item) => !MENU_TYPES.has(item.getId() ?? "")),
    ]);
