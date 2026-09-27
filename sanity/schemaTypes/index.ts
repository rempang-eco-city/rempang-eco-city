import type { SchemaTypeDefinition } from "sanity";
import { umkmProduct } from "./objects/umkmProduct";
import { koperasiPengurus } from "./objects/koperasiPengurus";
import { koperasiGalleryItem } from "./objects/koperasiGalleryItem";
import { newsArticle } from "./newsArticle";
import { umkmItem } from "./umkmItem";
import { koperasi } from "./koperasi";
import { pariwisataDestination } from "./pariwisataDestination";
import { profilPage } from "./profilPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    umkmProduct,
    koperasiPengurus,
    koperasiGalleryItem,
    newsArticle,
    umkmItem,
    koperasi,
    pariwisataDestination,
    profilPage,
  ],
};
