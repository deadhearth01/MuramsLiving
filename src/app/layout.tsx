import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PublicWrapper from "@/components/layout/PublicWrapper";
import DevToolsBlocker from "@/components/layout/DevToolsBlocker";
import SitePreloader from "@/components/layout/SitePreloader";
import { Analytics } from "@vercel/analytics/next";

const playfair = localFont({
  src: [
    {
      path: "./fonts/playfair-display.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/playfair-display-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/playfair-display-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/playfair-display-700-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-playfair",
  display: "swap",
});

const bricolage = localFont({
  src: [
    {
      path: "./fonts/bricolage-grotesque.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/bricolage-grotesque-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/bricolage-grotesque-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://muramsliving.com"),
  title: {
    default: "Murams Living — Premium PG & Hostel Near Rushikonda Beach, Visakhapatnam",
    template: "%s | Murams Living",
  },
  description:
    "Experience the best PG accommodation in Rushikonda, Visakhapatnam. Murams Living offers AC & Non-AC furnished rooms, home-cooked meals, 24/7 security, free WiFi, and stunning beach views — just 1 km from Rushikonda Beach.",
  keywords: [
    "PG in Rushikonda",
    "PG in Visakhapatnam",
    "hostel Rushikonda Vizag",
    "paying guest Visakhapatnam",
    "Murams Living",
    "PG Vizag",
    "PG near Rushikonda beach",
    "student PG Visakhapatnam",
    "student hostel Vizag",
    "PG near GITAM University",
    "PG near Andhra University Vizag",
    "guest house Rushikonda",
    "short stay Vizag beach",
    "AC PG rooms Visakhapatnam",
    "affordable hostel Vizag",
  ],
  authors: [{ name: "Murams Living", url: "https://muramsliving.com" }],
  creator: "Murams Living",
  publisher: "Murams Living",
  openGraph: {
    siteName: "Murams Living",
    title: "Murams Living — Premium PG & Hostel Near Rushikonda Beach",
    description:
      "AC & Non-AC rooms, home-cooked meals, 24/7 security, free WiFi — just 1 km from Rushikonda Beach, Visakhapatnam.",
    type: "website",
    locale: "en_IN",
    url: "https://muramsliving.com",
    images: [
      {
        url: "/clicks/beach-view.jpeg",
        width: 1200,
        height: 630,
        alt: "Murams Living — Beach View from Rushikonda, Visakhapatnam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Murams Living — Premium PG & Hostel Near Rushikonda Beach",
    description:
      "AC & Non-AC rooms, home-cooked meals, 24/7 security, free WiFi — 1 km from Rushikonda Beach, Visakhapatnam.",
    images: ["/clicks/beach-view.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  category: "travel",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["LodgingBusiness", "LocalBusiness"],
  "@id": "https://muramsliving.com/#business",
  name: "Murams Living",
  url: "https://muramsliving.com",
  logo: "https://muramsliving.com/logo.png",
  image: [
    "https://muramsliving.com/clicks/beach-view.jpeg",
    "https://muramsliving.com/clicks/beds.png",
    "https://muramsliving.com/Amenities/home-food.jpg",
  ],
  description:
    "Premium PG & hostel accommodation in Rushikonda, Visakhapatnam. AC & Non-AC furnished rooms, home-cooked meals, 24/7 security, free WiFi, 1 km from Rushikonda Beach.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rushikonda",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    postalCode: "530045",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 17.7872,
    longitude: 83.3783,
  },
  telephone: "+917816055655",
  email: "info@muramsliving.com",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Bank Transfer, UPI",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Meals Included", value: true },
    { "@type": "LocationFeatureSpecification", name: "24/7 Security", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Beach View Terrace", value: true },
    { "@type": "LocationFeatureSpecification", name: "Laundry Service", value: true },
    { "@type": "LocationFeatureSpecification", name: "Hot Water", value: true },
  ],
  hasMap: "https://maps.google.com/?q=Murams+Living+Rushikonda+Visakhapatnam",
  touristType: ["Students", "Guests", "Tourists", "Business Travelers"],
  checkinTime: "12:00",
  checkoutTime: "11:00",
  numberOfRooms: 40,
  starRating: { "@type": "Rating", ratingValue: "4.5" },
  knowsAbout: [
    "Student Accommodation",
    "Paying Guest Accommodation",
    "Beach View Rooms",
    "Hostel Services",
    "Home-Cooked Meals",
  ],
  keywords:
    "PG Rushikonda, hostel Visakhapatnam, student PG Vizag, paying guest Rushikonda beach, PG near GITAM University",
  slogan: "Your Home Away From Home — 1 km from Rushikonda Beach",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+917816055655",
      contactType: "reservations",
      areaServed: "IN",
      availableLanguage: ["English", "Telugu", "Hindi"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+917842222284",
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["English", "Telugu", "Hindi"],
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://muramsliving.com/#website",
  url: "https://muramsliving.com",
  name: "Murams Living",
  description:
    "Premium PG & Hostel in Rushikonda, Visakhapatnam — 1 km from Rushikonda Beach. AC & Non-AC rooms, home-cooked meals, 24/7 security, free WiFi.",
  publisher: { "@id": "https://muramsliving.com/#business" },
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://muramsliving.com/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${bricolage.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <DevToolsBlocker />
        <SitePreloader />
        <PublicWrapper>
          <main>{children}</main>
        </PublicWrapper>
        <Analytics />
      </body>
    </html>
  );
}
