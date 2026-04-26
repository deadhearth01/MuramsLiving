import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Murams Living",
  description: "Terms of Service for Murams Living PG & Hostel, Rushikonda, Visakhapatnam. Read our terms regarding bookings, stays, payments, and cancellations.",
  alternates: {
    canonical: "https://muramsliving.com/terms",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section
        className="py-20 md:py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 60%, #2A1A0E 100%)" }}
      >
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Please read these terms carefully before booking your stay at Murams Living.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="space-y-6 text-gray-700 text-sm md:text-base leading-relaxed">
            <p className="text-xs text-gray-500">Last updated: March 2025</p>
            <h2 className="font-heading font-bold text-xl text-[#1A2E5A]">1. Booking & Payment</h2>
            <p>
              A refundable deposit equivalent to one month&apos;s rent is required upon booking.
              Monthly fees are due between the 1st and 5th of each month.
            </p>
            <h2 className="font-heading font-bold text-xl text-[#1A2E5A]">2. Vacating Policy</h2>
            <p>
              Residents must provide a minimum of 1 month&apos;s prior notice before vacating.
              The advance deposit will be adjusted against the last month&apos;s rent.
            </p>
            <h2 className="font-heading font-bold text-xl text-[#1A2E5A]">3. House Rules</h2>
            <p>
              All residents must adhere to the Murams Living house rules displayed on the premises
              and listed on our website. Violation of rules may result in termination of stay.
            </p>
            <h2 className="font-heading font-bold text-xl text-[#1A2E5A]">4. Liability</h2>
            <p>
              Murams Living is not responsible for loss or damage to residents&apos; personal property.
              Residents are advised to keep valuables secured at all times.
            </p>
            <h2 className="font-heading font-bold text-xl text-[#1A2E5A]">5. Contact</h2>
            <p>
              For any questions regarding these terms, contact us at{" "}
              <a href="mailto:info@muramsliving.com" className="text-[#E8601C]">
                info@muramsliving.com
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
