import type { Metadata } from "next";
import GalleryPageClient from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos of Murams Living — rooms, dining area, terrace, common spaces, and more from our premium PG & hostel in Rushikonda, Visakhapatnam.",
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
