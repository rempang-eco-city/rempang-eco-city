"use client";

export default function RempangMap({ address }: { address: string }) {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=14&output=embed`;

  return (
    <iframe
      title="Rempang Eco City Map"
      src={mapUrl}
      className="h-[450px] w-full md:h-[520px] border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
