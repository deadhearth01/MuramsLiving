import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Murams Living — Our Story, Mission & Values | Rushikonda, Visakhapatnam",
  description:
    "Discover the story behind Murams Living — a family-run premium PG & hostel in Rushikonda, Visakhapatnam. Our mission: provide a safe, comfortable, and truly home-like experience for students, professionals, and tourists.",
  keywords: [
    "about Murams Living",
    "PG hostel Rushikonda story",
    "Murams Living founders",
    "best PG Visakhapatnam",
    "trusted hostel Vizag",
    "family run PG Rushikonda",
  ],
  alternates: {
    canonical: "https://muramsliving.com/about",
  },
  openGraph: {
    title: "About Murams Living — Our Story | Rushikonda, Visakhapatnam",
    description:
      "A family-run premium PG & hostel in Rushikonda, Vizag. Committed to safety, comfort, and a true home-like experience.",
    url: "https://muramsliving.com/about",
    type: "website",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://muramsliving.com/about#webpage",
  url: "https://muramsliving.com/about",
  name: "About Murams Living — Our Story, Mission & Values | Rushikonda, Visakhapatnam",
  description:
    "The story behind Murams Living — a family-run premium PG & hostel in Rushikonda, Visakhapatnam dedicated to safety, comfort, and a home-like experience.",
  isPartOf: { "@id": "https://muramsliving.com/#website" },
  about: { "@id": "https://muramsliving.com/#business" },
  inLanguage: "en-IN",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://muramsliving.com" },
      { "@type": "ListItem", position: 2, name: "About Us", item: "https://muramsliving.com/about" },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <AboutPageClient />
    </>
  );
}
