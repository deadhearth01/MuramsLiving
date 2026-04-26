import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Murams Living — Call +91 78160 55655 | Rushikonda, Visakhapatnam",
  description:
    "Contact Murams Living for room availability, pricing & bookings. Call or WhatsApp +91 78160 55655. Located in Rushikonda, Visakhapatnam, AP — 530045. Instant response guaranteed.",
  keywords: [
    "contact Murams Living",
    "PG booking Rushikonda phone",
    "Murams Living phone number",
    "Murams Living WhatsApp",
    "PG enquiry Visakhapatnam",
    "hostel contact Vizag",
    "book PG Rushikonda",
  ],
  alternates: {
    canonical: "https://muramsliving.com/contact",
  },
  openGraph: {
    title: "Contact Murams Living — +91 78160 55655 | Rushikonda, Visakhapatnam",
    description:
      "Call or WhatsApp for room availability & bookings. We respond within hours. Rushikonda, Visakhapatnam — 530045.",
    url: "https://muramsliving.com/contact",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Murams Living",
  url: "https://muramsliving.com",
  image: "https://muramsliving.com/logo.png",
  telephone: "+917816055655",
  email: "info@muramsliving.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rushikonda",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    postalCode: "530045",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 17.7872,
    longitude: 83.3783,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+917816055655",
      contactType: "reservations",
      areaServed: "IN",
      availableLanguage: ["English", "Telugu", "Hindi"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+917842222284",
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["English", "Telugu", "Hindi"],
    },
  ],
  sameAs: [
    "https://muramsliving.com",
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <ContactPageClient />
    </>
  );
}
