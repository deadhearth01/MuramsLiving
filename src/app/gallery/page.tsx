import type { Metadata } from "next";
import GalleryPageClient from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Photo Gallery — Rooms, Terrace, Dining & Facilities | Murams Living Rushikonda",
  description:
    "Browse photos of Murams Living — fully furnished AC/Non-AC rooms, beach view terrace, home-style dining area, common areas, and more. Premium PG & hostel in Rushikonda, Visakhapatnam.",
  keywords: [
    "Murams Living photos",
    "PG rooms photos Vizag",
    "hostel gallery Visakhapatnam",
    "Rushikonda PG pictures",
    "Murams Living gallery",
    "PG rooms interior Vizag",
    "beach view PG Visakhapatnam",
  ],
  alternates: {
    canonical: "https://muramsliving.com/gallery",
  },
  openGraph: {
    title: "Photo Gallery — Murams Living PG & Hostel, Rushikonda Visakhapatnam",
    description:
      "See AC/Non-AC furnished rooms, beach view terrace, dining area, and common spaces at Murams Living, Rushikonda, Vizag.",
    url: "https://muramsliving.com/gallery",
    type: "website",
    images: [
      {
        url: "/clicks/beach-view.jpeg",
        width: 1200,
        height: 630,
        alt: "Murams Living gallery — beach view terrace, Rushikonda Visakhapatnam",
      },
    ],
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://muramsliving.com/gallery#webpage",
  url: "https://muramsliving.com/gallery",
  name: "Photo Gallery — Rooms, Terrace, Dining & Facilities | Murams Living Rushikonda",
  description:
    "Browse photos of Murams Living — furnished AC/Non-AC rooms, beach view terrace, dining area, and common areas. Premium PG in Rushikonda, Visakhapatnam.",
  isPartOf: { "@id": "https://muramsliving.com/#website" },
  about: { "@id": "https://muramsliving.com/#business" },
  inLanguage: "en-IN",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://muramsliving.com" },
      { "@type": "ListItem", position: 2, name: "Gallery", item: "https://muramsliving.com/gallery" },
    ],
  },
};

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <GalleryPageClient />
    </>
  );
}
