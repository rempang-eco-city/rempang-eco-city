import type { StructureResolver } from "sanity/structure";
import { INSTAGRAM_SECRETS_ID } from "./schemaTypes/instagramSecrets";

// Studio sidebar, in the same order as the site's Navbar.
// - "singleton": opens its one document directly (edited at _id === type name)
// - "list": shows all documents of `type`
// - "listWithHeader": a folder with the page's header singleton (shown as
//   `headerTitle`, default "Header Halaman"), the list, then any `extras`
//   (singletons stored at a custom _id)
type MenuItem =
  | { kind: "singleton"; type: string; title: string }
  | { kind: "list"; type: string; title: string }
  | {
      kind: "listWithHeader";
      type: string;
      headerType: string;
      title: string;
      headerTitle?: string;
      listTitle: string;
      extras?: { type: string; id: string; title: string }[];
    };

const MENU: MenuItem[] = [
  {
    kind: "listWithHeader",
    type: "petaLokasi",
    headerType: "berandaPage",
    title: "Halaman Beranda",
    headerTitle: "Konten Halaman",
    listTitle: "Lokasi di Peta",
    extras: [{ type: "instagramSecrets", id: INSTAGRAM_SECRETS_ID, title: "Token Instagram" }],
  },
  { kind: "singleton", type: "profilPage", title: "Halaman Profil" },
  { kind: "list", type: "koperasi", title: "Halaman Koperasi" },
  { kind: "singleton", type: "pariwisataPage", title: "Halaman Pariwisata" },
  { kind: "listWithHeader", type: "umkmItem", headerType: "umkmPage", title: "Halaman UMKM", listTitle: "Daftar UMKM" },
  { kind: "listWithHeader", type: "newsArticle", headerType: "beritaPage", title: "Halaman Berita", listTitle: "Daftar Berita" },
];

export const SINGLETON_TYPES = new Set<string>(
  MENU.flatMap((item) =>
    item.kind === "singleton"
      ? [item.type]
      : item.kind === "listWithHeader"
        ? [item.headerType, ...(item.extras ?? []).map(({ type }) => type)]
        : []
  )
);

const MENU_TYPES = new Set<string>([...MENU.map(({ type }) => type), ...SINGLETON_TYPES]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      ...MENU.map((item) => {
        const singleton = (type: string, title: string, id = type) =>
          S.listItem()
            .title(title)
            .id(type)
            .child(S.document().schemaType(type).documentId(id).title(title));

        if (item.kind === "singleton") return singleton(item.type, item.title);
        if (item.kind === "list") return S.documentTypeListItem(item.type).title(item.title);
        return S.listItem()
          .title(item.title)
          .id(`${item.type}-folder`)
          .child(
            S.list()
              .title(item.title)
              .items([
                singleton(item.headerType, item.headerTitle ?? "Header Halaman"),
                S.documentTypeListItem(item.type).title(item.listTitle),
                ...(item.extras ?? []).map(({ type, id, title }) => singleton(type, title, id)),
              ])
          );
      }),
      // Safety net: any document type added later but not in MENU still shows up.
      ...S.documentTypeListItems().filter((item) => !MENU_TYPES.has(item.getId() ?? "")),
    ]);
