import type { Metadata } from "next";
import StudentsPageClient from "./StudentsPageClient";

export const metadata: Metadata = {
  title: "Student PG in Rushikonda — Near GITAM, GIMSR & Andhra University, Vizag",
  description:
    "Best student PG in Rushikonda, Visakhapatnam — near GITAM University, GIMSR & Andhra University. Affordable 2, 3 & 4 sharing AC/Non-AC rooms with home-cooked meals, free WiFi, 24/7 security & a focused study environment.",
  keywords: [
    "student PG Rushikonda",
    "student hostel Visakhapatnam",
    "PG near GITAM University",
    "PG near GIMSR medical college",
    "PG near Andhra University Vizag",
    "student accommodation Vizag",
    "2 sharing PG Visakhapatnam",
    "3 sharing PG Vizag",
    "4 sharing hostel Vizag",
    "affordable student PG Rushikonda",
    "long stay PG Vizag",
    "student PG with meals Visakhapatnam",
    "boys PG Rushikonda Vizag",
    "girls PG Rushikonda Visakhapatnam",
    "monthly PG Vizag with food WiFi",
    "student rooms Rushikonda beach Vizag",
    "PG hostel near GITAM Rushikonda",
  ],
  alternates: {
    canonical: "https://muramsliving.com/students",
  },
  openGraph: {
    title: "Student PG in Rushikonda — Near GITAM, GIMSR & Andhra University, Vizag",
    description:
      "Affordable 2, 3 & 4 sharing AC/Non-AC rooms for students near GITAM University. Meals, WiFi, security included. Rushikonda, Visakhapatnam.",
    url: "https://muramsliving.com/students",
    type: "website",
    images: [
      {
        url: "/clicks/beds.png",
        width: 1200,
        height: 630,
        alt: "Student PG rooms at Murams Living, Rushikonda Visakhapatnam",
      },
    ],
  },
};

const studentFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which colleges are near Murams Living student PG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Murams Living is conveniently located near GITAM University, GIMSR Medical College, Andhra University, and other institutions in the Rushikonda–Visakhapatnam corridor.",
      },
    },
    {
      "@type": "Question",
      name: "What sharing options are available for students?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer 2-sharing, 3-sharing, and 4-sharing furnished rooms. Both AC and Non-AC options are available for all sharing types.",
      },
    },
    {
      "@type": "Question",
      name: "Are meals included in the student PG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, home-cooked meals are included — breakfast, lunch, and dinner prepared fresh in our hygienic in-house kitchen every day.",
      },
    },
    {
      "@type": "Question",
      name: "What documents are needed for student admission?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You will need a government-issued photo ID (Aadhaar card or passport), 2 passport-size photos, your college ID or admission letter, and an emergency contact number.",
      },
    },
    {
      "@type": "Question",
      name: "What is the minimum stay period for students?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The minimum stay for students is 1 month. We accommodate stays from 1 to 24 months to match semester and academic year cycles.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a security deposit for student bookings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, a refundable security deposit of one month's rent is collected on arrival, along with the first month's rent.",
      },
    },
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://muramsliving.com/students#webpage",
  url: "https://muramsliving.com/students",
  name: "Student PG in Rushikonda — Near GITAM, GIMSR & Andhra University, Vizag",
  description:
    "Best student PG in Rushikonda, Visakhapatnam — near GITAM University & Andhra University. Affordable 2, 3 & 4 sharing AC/Non-AC rooms with home-cooked meals, free WiFi & 24/7 security.",
  isPartOf: { "@id": "https://muramsliving.com/#website" },
  about: { "@id": "https://muramsliving.com/#business" },
  inLanguage: "en-IN",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2"],
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://muramsliving.com" },
      { "@type": "ListItem", position: 2, name: "For Students", item: "https://muramsliving.com/students" },
    ],
  },
};

export default function StudentsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studentFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <StudentsPageClient />
    </>
  );
}
