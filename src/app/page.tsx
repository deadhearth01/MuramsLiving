import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Welcome from "@/components/home/Welcome";
import RoomTypes from "@/components/home/RoomTypes";
import Highlights from "@/components/home/Highlights";
import AmenitiesSection from "@/components/home/AmenitiesSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import Testimonials from "@/components/home/Testimonials";
import NearbyAttractions from "@/components/home/NearbyAttractions";
import Rules from "@/components/home/Rules";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Murams Living — #1 PG & Hostel Near Rushikonda Beach, Visakhapatnam",
  description:
    "Murams Living is Rushikonda's premier paying guest & hostel — 1 km from Rushikonda Beach. AC & Non-AC furnished rooms, home-cooked meals, free WiFi, 24/7 security. Ideal for students near GITAM & Andhra University. Book now.",
  keywords: [
    "PG in Rushikonda",
    "best PG Visakhapatnam",
    "hostel near Rushikonda beach",
    "paying guest Vizag",
    "Murams Living Rushikonda",
    "PG near GITAM University Visakhapatnam",
    "student hostel Vizag beach",
    "AC PG rooms Rushikonda",
    "guest house Vizag beach",
    "short stay Rushikonda Visakhapatnam",
    "home food PG Vizag",
    "affordable PG near beach Vizag",
  ],
  alternates: {
    canonical: "https://muramsliving.com",
  },
  openGraph: {
    title: "Murams Living — #1 PG & Hostel Near Rushikonda Beach, Visakhapatnam",
    description:
      "1 km from Rushikonda Beach. AC & Non-AC furnished rooms, home-cooked meals, free WiFi, 24/7 security. Perfect for students and tourists.",
    url: "https://muramsliving.com",
    type: "website",
    images: [
      {
        url: "/clicks/beach-view.jpeg",
        width: 1200,
        height: 630,
        alt: "Murams Living — Beach view from Rushikonda, Visakhapatnam",
      },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Murams Living?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Murams Living is a premium paying guest (PG) & hostel in Rushikonda, Visakhapatnam, just 1 km from Rushikonda Beach. We offer fully furnished AC and Non-AC rooms for students, working professionals, and tourists.",
      },
    },
    {
      "@type": "Question",
      name: "How far is Murams Living from Rushikonda Beach?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Murams Living is just 1 km from Rushikonda Beach, making it one of the closest PG accommodations to the beach in Visakhapatnam.",
      },
    },
    {
      "@type": "Question",
      name: "What amenities are included at Murams Living?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Amenities include free high-speed WiFi, home-cooked meals (breakfast, lunch & dinner), 24/7 security, AC & Non-AC room options, hot water, housekeeping, laundry service, a beach view terrace, and parking.",
      },
    },
    {
      "@type": "Question",
      name: "Is Murams Living suitable for students?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Murams Living is ideal for students. We are conveniently located near GITAM University, GIMSR Medical College, and Andhra University, and offer long-term stay options with 2, 3, and 4-sharing rooms at affordable rates.",
      },
    },
    {
      "@type": "Question",
      name: "Does Murams Living accept short-term tourist stays?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We welcome tourists and guests for short stays with flexible check-in and check-out. Our location near Rushikonda Beach is perfect for those exploring Visakhapatnam.",
      },
    },
    {
      "@type": "Question",
      name: "How do I book a room at Murams Living?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book online at muramsliving.com/book or call us directly at +91 78160 55655. Fill in your details and our team will confirm your booking within a few hours.",
      },
    },
    {
      "@type": "Question",
      name: "What buildings does Murams Living have?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Murams Living has two buildings — the Gold Building and the Silver Building. Both offer fully furnished rooms with all amenities included.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://muramsliving.com",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Hero />
      <Welcome />
      <RoomTypes />
      <Highlights />
      <AmenitiesSection />
      <GalleryPreview />
      <Testimonials />
      <NearbyAttractions />
      <Rules />
      <CTASection />
    </>
  );
}
