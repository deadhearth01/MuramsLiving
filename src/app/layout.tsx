import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PublicWrapper from "@/components/layout/PublicWrapper";

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
  title: {
    default: "Murams Living - Premium PG & Hostel in Rushikonda, Visakhapatnam",
    template: "%s | Murams Living",
  },
  description:
    "Murams Living offers premium PG and hostel accommodation in Rushikonda, Visakhapatnam. Fully furnished rooms, A/C & Non-A/C options, home-cooked meals, 24/7 security, and stunning beach views.",
  keywords: [
    "PG in Rushikonda",
    "Hostel Visakhapatnam",
    "Murams Living",
    "PG Vizag",
    "Paying Guest Rushikonda",
    "Student accommodation Vizag",
    "Working professionals PG Visakhapatnam",
  ],
  openGraph: {
    title: "Murams Living - Premium PG & Hostel in Rushikonda",
    description:
      "Your perfect home-like stay in Rushikonda, Visakhapatnam. A/C rooms, home food, beach view.",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Murams Living",
      },
    ],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
        <PublicWrapper>
          <main>{children}</main>
        </PublicWrapper>
      </body>
    </html>
  );
}
