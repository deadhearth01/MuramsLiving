"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Users, Star, MapPin, Phone } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";

const values = [
  {
    icon: Heart,
    title: "Comfort First",
    description:
      "We prioritize your comfort above all else, ensuring every aspect of your stay exceeds expectations.",
  },
  {
    icon: Shield,
    title: "Safety Always",
    description:
      "24/7 security, CCTV surveillance, and biometric access ensure you feel completely safe at all times.",
  },
  {
    icon: Users,
    title: "Community Living",
    description:
      "We foster a vibrant community where residents connect, grow, and support each other.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description:
      "From marble flooring to Free Wifi, we offer premium amenities at affordable prices.",
  },
];

const stats = [
  { value: "500+", label: "Happy Residents" },
  { value: "4.9", label: "Google Rating" },
  { value: "5+", label: "Years Serving" },
  { value: "24/7", label: "Support" },
];

export default function AboutPageClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <section className="py-20 md:py-28 bg-navy-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container-custom relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              Our Story
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-5 leading-tight">
              About Murams Living
            </h1>
            <p className="text-white/65 text-lg leading-relaxed">
              Building a home away from home for students and working
              professionals in the beautiful coastal city of Visakhapatnam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <AnimatedSection>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/clicks/077b49fa-bcf4-4a4b-b13d-c97087b50380.JPG"
                  alt="Murams Living"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-5 right-5 bg-primary text-white px-5 py-4 rounded-2xl shadow-lg">
                  <div className="font-heading font-bold text-3xl leading-none">
                    500+
                  </div>
                  <div className="text-sm opacity-90 mt-0.5">
                    Happy Residents
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
                Our Story
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-navy mb-6 leading-tight">
                How It All Began
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Murams Living was born from a simple yet powerful vision: to
                  provide students and working professionals in Visakhapatnam
                  with a living experience that truly feels like home. Founded
                  in 2020, we set out to create a space where comfort, safety,
                  and community converge.
                </p>
                <p>
                  Located in the scenic Rushikonda area — just 1 km from the
                  famous Rushikonda Beach — our PG &amp; hostel offers the
                  perfect blend of serene surroundings and urban convenience.
                  With easy access to IT parks, educational institutions, and
                  city amenities, we are ideally situated for today&apos;s
                  dynamic residents.
                </p>
                <p>
                  Our fully-furnished building features marble flooring, A/C and
                  Non-A/C rooms, a dedicated dining area serving home-cooked
                  meals, Free Wifi, and a stunning beach-view terrace — all
                  maintained with the highest standards of cleanliness and
                  security.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin size={15} className="text-primary" />
                  Rushikonda, Visakhapatnam
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Phone size={15} className="text-primary" />
                  +91 7816055655
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-navy">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <AnimatedSection key={stat.label} className="text-center">
                <div className="font-heading text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-surface-secondary">
        <div className="container-custom">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              Our Values
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-navy mb-4">
              What We Stand For
            </h2>
            <p className="text-text-secondary">
              Our core values guide everything we do — from how we build our
              spaces to how we serve our residents.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.08}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-navy mb-2">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <AnimatedSection>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-white/60 mb-8">
              Experience the Murams Living difference. Contact us today to check
              room availability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+917816055655"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-xl transition-all"
              >
                <Phone size={18} />
                Call Us Now
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
