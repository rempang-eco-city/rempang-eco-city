import type { SchemaTypeDefinition } from "sanity";
import { umkmProduct } from "./objects/umkmProduct";
import { koperasiPengurus } from "./objects/koperasiPengurus";
import { koperasiGalleryItem } from "./objects/koperasiGalleryItem";
import { koperasiLaporanKeuangan } from "./objects/koperasiLaporanKeuangan";
import { koperasiFasilitas } from "./objects/koperasiFasilitas";
import { koperasiLayanan } from "./objects/koperasiLayanan";
import { koperasiProdukIkan } from "./objects/koperasiProdukIkan";
import { koperasiTestimoni } from "./objects/koperasiTestimoni";
import { pariwisataPaket } from "./objects/pariwisataPaket";
import { strukturJabatan, strukturOrganisasi } from "./objects/strukturOrganisasi";
import { newsArticle } from "./newsArticle";
import { umkmItem } from "./umkmItem";
import { koperasi } from "./koperasi";
import { pariwisataDestination } from "./pariwisataDestination";
import { profilPage } from "./profilPage";
import { berandaPage } from "./berandaPage";
import { pariwisataPage } from "./pariwisataPage";
import { beritaPage, umkmPage } from "./listingPageHeaders";
import { petaLokasi } from "./petaLokasi";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    umkmProduct,
    koperasiPengurus,
    koperasiGalleryItem,
    koperasiLaporanKeuangan,
    koperasiFasilitas,
    koperasiLayanan,
    koperasiProdukIkan,
    koperasiTestimoni,
    pariwisataPaket,
    strukturJabatan,
    strukturOrganisasi,
    newsArticle,
    umkmItem,
    koperasi,
    pariwisataDestination,
    profilPage,
    berandaPage,
    pariwisataPage,
    umkmPage,
    beritaPage,
    petaLokasi,
  ],
};
