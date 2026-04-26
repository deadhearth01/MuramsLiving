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

export default function GalleryPage() {
  return <GalleryPageClient />;
}
