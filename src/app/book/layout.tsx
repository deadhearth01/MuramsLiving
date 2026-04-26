import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Room — PG & Guest Stay Near Rushikonda Beach, Vizag",
  description:
    "Book your stay at Murams Living in minutes. Choose AC or Non-AC rooms for student long-term PG or short guest visits. Just 1 km from Rushikonda Beach, Visakhapatnam. Get instant confirmation.",
  keywords: [
    "book PG Rushikonda",
    "book hostel Visakhapatnam",
    "online booking PG Vizag",
    "reserve room Rushikonda beach",
    "PG room booking Vizag",
    "short stay booking Visakhapatnam",
    "student PG booking Visakhapatnam",
    "hostel room reservation Vizag",
  ],
  alternates: {
    canonical: "https://muramsliving.com/book",
  },
  openGraph: {
    title: "Book a Room — Murams Living, Rushikonda Beach, Vizag",
    description:
      "AC & Non-AC rooms, student long-term PG or short guest stays. 1 km from Rushikonda Beach. Book now.",
    url: "https://muramsliving.com/book",
    type: "website",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Book a Room at Murams Living, Rushikonda, Visakhapatnam",
  description:
    "Simple 3-step process to book your PG or guest stay at Murams Living — Rushikonda's top-rated hostel, 1 km from Rushikonda Beach.",
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Fill in your details",
      text: "Enter your name, phone number, and email. Select your preferred building (Gold or Silver), room type (AC or Non-AC), and sharing option (2, 3, or 4 sharing). For students, choose the number of months; for guests, select your check-in and check-out dates.",
      url: "https://muramsliving.com/book",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Submit your booking request",
      text: "Click 'Submit Booking Request'. You will receive an email confirmation with your booking ID within minutes.",
      url: "https://muramsliving.com/book",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Our team calls to confirm",
      text: "Our team will call you within a few hours to confirm your room and answer any questions. No advance payment required — just pay on arrival.",
      url: "https://muramsliving.com/book",
    },
  ],
  tool: [
    { "@type": "HowToTool", name: "Internet-connected device" },
  ],
};

const bookPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://muramsliving.com/book#webpage",
  url: "https://muramsliving.com/book",
  name: "Book a Room — Murams Living PG & Hostel, Rushikonda, Visakhapatnam",
  description:
    "Online room booking for Murams Living. Student long-term PG or short guest stays. 1 km from Rushikonda Beach, Visakhapatnam.",
  isPartOf: { "@id": "https://muramsliving.com/#website" },
  about: { "@id": "https://muramsliving.com/#business" },
  inLanguage: "en-IN",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://muramsliving.com" },
      { "@type": "ListItem", position: 2, name: "Book a Room", item: "https://muramsliving.com/book" },
    ],
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookPageSchema) }}
      />
      {children}
    </>
  );
}
