import { umkmCatalog } from "@/data/umkmCatalog";

export const umkms = umkmCatalog.map((umkm) => ({
  id: umkm.id,
  title: umkm.name,
  subtitle: umkm.cardDescription,
  image: umkm.image,
  href: `/umkm/${umkm.slug}`,
}));
