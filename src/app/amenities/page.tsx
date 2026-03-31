import type { Metadata } from "next";
import AmenitiesPageClient from "./AmenitiesPageClient";

export const metadata: Metadata = {
  title: "Amenities",
  description:
    "Explore the premium amenities at Murams Living — A/C rooms, high-speed WiFi, home-cooked meals, 24/7 security, beach view terrace, and much more.",
};

export default function AmenitiesPage() {
  return <AmenitiesPageClient />;
}
