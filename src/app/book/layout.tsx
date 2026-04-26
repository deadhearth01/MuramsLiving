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

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
