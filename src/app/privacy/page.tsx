import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Murams Living",
  description: "Privacy Policy for Murams Living PG & Hostel, Rushikonda, Visakhapatnam. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://muramsliving.com/privacy",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section
        className="py-20 md:py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 60%, #2A1A0E 100%)" }}
      >
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-white/80 max-w-xl mx-auto">
            How Murams Living collects, uses, and protects your personal information.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm md:text-base leading-relaxed">
            <p className="text-xs text-gray-500">Last updated: March 2025</p>
            <h2 className="font-heading font-bold text-xl text-[#1A2E5A]">1. Information We Collect</h2>
            <p>
              When you enquire or book a room at Murams Living, we may collect your name, phone number,
              email address, and other contact details you provide. We use this information solely to
              respond to your enquiry and manage your stay.
            </p>
            <h2 className="font-heading font-bold text-xl text-[#1A2E5A]">2. How We Use Your Information</h2>
            <p>
              Your personal information is used to contact you regarding your booking, provide resident
              services, and communicate important notices. We do not sell, rent, or share your data with
              third parties for marketing purposes.
            </p>
            <h2 className="font-heading font-bold text-xl text-[#1A2E5A]">3. Data Security</h2>
            <p>
              We take reasonable measures to protect your personal data from unauthorized access,
              alteration, disclosure, or destruction.
            </p>
            <h2 className="font-heading font-bold text-xl text-[#1A2E5A]">4. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at{" "}
              <a href="mailto:info@muramsliving.com" className="text-[#E8601C]">
                info@muramsliving.com
              </a>{" "}
              or call{" "}
              <a href="tel:+917816055655" className="text-[#E8601C]">
                +91 7816055655
              </a>.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/" className="btn-primary inline-flex">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
