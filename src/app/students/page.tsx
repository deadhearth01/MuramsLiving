import type { Metadata } from "next";
import StudentsPageClient from "./StudentsPageClient";

export const metadata: Metadata = {
  title: "For Students | Murams Living",
  description:
    "Murams Living is the ideal student PG in Rushikonda, Visakhapatnam — near GITAM, GIMSR, and Andhra University. Free Wifi, home-cooked meals, 24/7 security, and a focused study environment.",
};

export default function StudentsPage() {
  return <StudentsPageClient />;
}
