import type { Metadata } from "next";
import TouristsPageClient from "./TouristsPageClient";

export const metadata: Metadata = {
  title: "For Guests | Murams Living",
  description:
    "Visiting Visakhapatnam? Stay at Murams Living — just 3 minutes from Rushikonda Beach. Flexible short stays, all meals included, prime location near Vizag's top attractions.",
};

export default function TouristsPage() {
  return <TouristsPageClient />;
}
