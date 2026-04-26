import type { Metadata } from "next";
import GuestsPageClient from "./GuestsPageClient";

export const metadata: Metadata = {
  title: "Guest Rooms & Short Stays Near Rushikonda Beach, Vizag | Murams Living",
  description:
    "Plan your Visakhapatnam getaway at Murams Living — just 1 km from Rushikonda Beach. Flexible short stays with home-cooked meals, AC rooms & easy access to Araku Valley, Borra Caves, Kailasagiri & Vizag's top attractions.",
  keywords: [
    "guest house Rushikonda beach",
    "short stay Visakhapatnam",
    "tourist accommodation Vizag",
    "hotel near Rushikonda beach",
    "beach stay Vizag",
    "family stay Visakhapatnam",
    "holiday accommodation Vizag",
    "Rushikonda beach accommodation",
    "places to stay Visakhapatnam",
    "weekend stay Vizag beach",
    "budget stay near Rushikonda",
    "Vizag tourist stay with meals",
  ],
  alternates: {
    canonical: "https://muramsliving.com/guests",
  },
  openGraph: {
    title: "Guest Rooms & Short Stays Near Rushikonda Beach, Vizag",
    description:
      "1 km from Rushikonda Beach. Flexible short stays, home-cooked meals, AC rooms. Explore Vizag from the perfect base.",
    url: "https://muramsliving.com/guests",
    type: "website",
    images: [
      {
        url: "/clicks/beach-view.jpeg",
        width: 1200,
        height: 630,
        alt: "Beach view from Murams Living, Rushikonda Visakhapatnam",
      },
    ],
  },
};

const guestFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How far is Murams Living from Rushikonda Beach?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Murams Living is just 1 km from Rushikonda Beach — a 5-minute walk. You can enjoy the beach and return to a comfortable, secure room.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a minimum stay period for guests?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No minimum stay is required. We welcome guests for any duration — whether it's one night or a week-long Vizag exploration.",
      },
    },
    {
      "@type": "Question",
      name: "Are meals included in the guest stay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, home-cooked meals are included in your stay. Our kitchen serves fresh breakfast, lunch, and dinner daily.",
      },
    },
    {
      "@type": "Question",
      name: "What tourist attractions are near Murams Living?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Murams Living is close to Rushikonda Beach, Kailasagiri, Rishikonda Hill, RK Beach, Submarine Museum, Araku Valley, Borra Caves, and Vizag's famous INS Kursura submarine museum.",
      },
    },
    {
      "@type": "Question",
      name: "Is advance payment required to book a guest stay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No advance payment is needed. You pay only on arrival after our team confirms your booking via phone.",
      },
    },
  ],
};

export default function GuestsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guestFaqSchema) }}
      />
      <GuestsPageClient />
    </>
  );
}
