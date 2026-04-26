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

export default function AboutPage() {
  return <AboutPageClient />;
}
