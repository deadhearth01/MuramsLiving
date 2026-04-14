import type { Metadata } from "next";
import SilverPageClient from "./SilverPageClient";

export const metadata: Metadata = {
  title: "Silver Building | Murams Living",
  description:
    "Murams Living Silver Building — premium PG rooms in Rushikonda, Visakhapatnam with dedicated parking, modern interiors, and all-inclusive amenities. Ideal for professionals and senior students.",
};

export default function SilverPage() {
  return <SilverPageClient />;
}
