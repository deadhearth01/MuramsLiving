import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Murams Living. Call us, send a WhatsApp message, or fill out our enquiry form to book your stay in Rushikonda, Visakhapatnam.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
