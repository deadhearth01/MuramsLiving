import type { Metadata } from "next";
import AmenitiesPageClient from "./AmenitiesPageClient";

export const metadata: Metadata = {
  title: "Amenities — AC Rooms, Home Food, Free WiFi, Beach View & More | Rushikonda, Vizag",
  description:
    "Discover all amenities at Murams Living: AC & Non-AC furnished rooms, home-cooked meals, high-speed free WiFi, 24/7 security, beach view terrace, housekeeping, laundry, hot water & more. Rushikonda, Visakhapatnam.",
  keywords: [
    "PG amenities Visakhapatnam",
    "AC rooms PG Vizag",
    "home food hostel Rushikonda",
    "free WiFi PG Vizag",
    "24/7 security PG Visakhapatnam",
    "beach view terrace PG Vizag",
    "laundry PG Rushikonda",
    "furnished rooms Visakhapatnam",
    "all inclusive PG Vizag",
  ],
  alternates: {
    canonical: "https://muramsliving.com/amenities",
  },
  openGraph: {
    title: "Amenities at Murams Living — AC Rooms, Home Food, WiFi & Beach View Terrace",
    description:
      "AC & Non-AC rooms, home-cooked meals, free WiFi, 24/7 security, beach view terrace, laundry & more at Murams Living, Rushikonda, Vizag.",
    url: "https://muramsliving.com/amenities",
    type: "website",
    images: [
      {
        url: "/Amenities/home-food.jpg",
        width: 1200,
        height: 630,
        alt: "Home-cooked meals at Murams Living, Rushikonda Visakhapatnam",
      },
    ],
  },
};

export default function AmenitiesPage() {
  return <AmenitiesPageClient />;
}
