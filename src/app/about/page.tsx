import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Murams Living — a premium PG and hostel in Rushikonda, Visakhapatnam offering comfort, safety, and a true home-like experience.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
