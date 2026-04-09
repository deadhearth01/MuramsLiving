"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, ArrowRight, MapPin, Clock, Building2, Shield, Utensils, Wifi, Waves } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const trustItems = [
  { icon: Building2,  label: "New Building"     },
  { icon: Shield,     label: "24/7 Security"     },
  { icon: Utensils,   label: "Home-Cooked Food"  },
  { icon: Wifi,       label: "High-Speed WiFi"   },
  { icon: Waves,      label: "Near the Beach"    },
];

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-navy-dark relative overflow-hidden">
      {/* Subtle grid pattern — no blobs */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">

          {/* Live availability indicator */}
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 mb-8 text-white/50 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Rooms available now
            </div>
          </AnimatedSection>

          {/* Heading */}
          <AnimatedSection delay={0.1}>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to call<br />
              <span className="text-primary">Murams Living</span> home?
            </h2>
          </AnimatedSection>

          {/* Body */}
          <AnimatedSection delay={0.2}>
            <p className="text-white/55 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Schedule a visit, check room availability, or just have a chat.
              We&apos;re here to help you find the right fit.
            </p>
          </AnimatedSection>

          {/* CTA buttons */}
          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.a
                href="/book"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all text-sm"
              >
                Check Availability & Book
                <ArrowRight size={16} />
              </motion.a>

              <motion.a
                href="https://wa.me/917816055655?text=Hi%20Murams%20Living!%20I%27m%20interested%20in%20booking%20a%20room."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-xl hover:opacity-90 transition-all text-sm"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </motion.a>
            </div>
          </AnimatedSection>

          {/* Contact info row */}
          <AnimatedSection delay={0.35}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10 text-white/40 text-sm mb-14">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary/70" />
                Rushikonda, Visakhapatnam
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-primary/70" />
                Visits: 9 AM – 8 PM
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary/70" />
                +91 78160 55655
              </div>
            </div>
          </AnimatedSection>

          {/* Trust strip — icons, no emojis */}
          <AnimatedSection delay={0.4}>
            <div className="border-t border-white/10 pt-10">
              <div className="flex flex-wrap items-center justify-center gap-7 lg:gap-12">
                {trustItems.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-white/35">
                    <Icon size={15} className="text-white/30" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
