import type { Metadata } from "next";
import SilverPageClient from "./SilverPageClient";

export const metadata: Metadata = {
  title: "Silver Building — Premium PG Rooms in Rushikonda, Visakhapatnam",
  description:
    "Murams Living Silver Building: premium AC & Non-AC furnished PG rooms in Rushikonda, Vizag. Dedicated parking, modern interiors, beach view terrace, all-inclusive amenities. Ideal for professionals and senior students.",
  keywords: [
    "Silver Building PG Rushikonda",
    "premium PG Visakhapatnam",
    "Murams Living Silver",
    "AC PG rooms Vizag",
    "PG with parking Visakhapatnam",
    "professional PG Rushikonda",
    "furnished rooms Rushikonda Vizag",
    "modern PG Visakhapatnam",
  ],
  alternates: {
    canonical: "https://muramsliving.com/silver",
  },
  openGraph: {
    title: "Silver Building — Premium PG in Rushikonda, Visakhapatnam | Murams Living",
    description:
      "Premium AC/Non-AC furnished rooms, dedicated parking, beach view terrace. Perfect for professionals and senior students in Rushikonda, Vizag.",
    url: "https://muramsliving.com/silver",
    type: "website",
    images: [
      {
        url: "/clicks/beach-view.jpeg",
        width: 1200,
        height: 630,
        alt: "Murams Living Silver Building, Rushikonda Visakhapatnam",
      },
    ],
  },
};

const silverSchema = {
  "@context": "https://schema.org",
  "@type": "Accommodation",
  name: "Murams Living — Silver Building",
  description:
    "Premium PG accommodation in the Silver Building at Murams Living, Rushikonda, Visakhapatnam. Modern furnished AC and Non-AC rooms with dedicated parking, beach view terrace, and all-inclusive amenities.",
  url: "https://muramsliving.com/silver",
  containedInPlace: {
    "@type": "LodgingBusiness",
    name: "Murams Living",
    url: "https://muramsliving.com",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rushikonda",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    postalCode: "530045",
    addressCountry: "IN",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Dedicated Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Beach View Terrace", value: true },
    { "@type": "LocationFeatureSpecification", name: "Home-Cooked Meals", value: true },
    { "@type": "LocationFeatureSpecification", name: "24/7 Security", value: true },
  ],
};

export default function SilverPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(silverSchema) }}
      />
      <SilverPageClient />
    </>
  );
}
