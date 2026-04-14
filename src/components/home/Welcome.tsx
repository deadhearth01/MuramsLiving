"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Building2, Layers, Wind, UtensilsCrossed, Sunset, MapPin,
  ArrowRight, Phone, Star,
} from "lucide-react";
import Link from "next/link";
import { Counter } from "@/components/ui/TextReveal";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const highlights = [
  { icon: Building2, text: "Modern new building"    },
  { icon: Layers,    text: "Marble flooring"         },
  { icon: Wind,      text: "AC & Non-AC rooms"       },
  { icon: UtensilsCrossed, text: "Home-cooked meals" },
  { icon: Sunset,    text: "Beach view terrace"      },
  { icon: MapPin,    text: "Near IT hubs & colleges" },
];

const stats = [
  { value: 2015, label: "Year Est.",         prefix: "",  suffix: ""   },
  { value: 1000, label: "Happy Residents",   prefix: "",  suffix: "+"  },
  { value: 21,   label: "Amenities",         prefix: "",  suffix: "+"  },
  { value: 4.6,  label: "Google Rating",     prefix: "",  suffix: "★", decimals: 1 },
];

export default function Welcome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-24 lg:py-32 bg-white relative" ref={containerRef}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">

          {/* ── Left: Stats panel ─────────────────────────────────── */}
          <AnimatedSection animation="fadeRight" className="lg:col-span-5 order-2 lg:order-1">
            {/* Top info block */}
            <div className="bg-navy rounded-2xl p-7 mb-4 text-white">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">Rushikonda, Visakhapatnam</p>
                  <p className="text-white/50 text-xs">Andhra Pradesh — 530045</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Located steps from the beach, surrounded by IT parks and colleges.
                The best spot to live, study, and grow in Vizag.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="bg-surface-secondary border border-gray-100 rounded-2xl p-5"
                >
                  <div className="font-heading font-bold text-2xl lg:text-3xl text-navy mb-1 leading-none">
                    {stat.prefix}
                    {isInView && (
                      <Counter
                        from={0}
                        to={stat.value}
                        duration={2}
                        delay={0.3 + i * 0.08}
                        decimals={stat.decimals}
                      />
                    )}
                    <span className="text-primary">{stat.suffix}</span>
                  </div>
                  <p className="text-text-secondary text-xs font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Google rating strip */}
            <motion.a
              href="https://maps.app.goo.gl/4nWFLswApRBM9YB87"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mt-4 p-4 border border-gray-100 rounded-xl hover:border-primary/30 hover:bg-primary/3 transition-all group"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-navy">4.6 on Google Reviews</span>
              <ArrowRight size={14} className="text-primary ml-auto group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </AnimatedSection>

          {/* ── Right: Content ────────────────────────────────────── */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <AnimatedSection animation="fadeLeft" delay={0.1}>
              <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
                Welcome to Murams Living
              </p>

              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy mb-6 leading-tight">
                More than a room —<br />
                a real home in Vizag.
              </h2>

              <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-8 max-w-xl">
                Nestled in the coastal haven of Rushikonda, Murams Living is designed for
                students and professionals who want more than four walls. Thoughtful amenities,
                home-cooked food, round-the-clock security, and a community that makes
                every day feel grounded.
              </p>

              {/* Features grid — icons, no emojis */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {highlights.map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/3 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-navy leading-tight">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/about"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy-dark transition-all duration-300 text-sm"
                >
                  About Murams Living
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="tel:+917816055655"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-gray-200 text-navy font-semibold rounded-xl hover:border-primary hover:text-primary transition-all duration-300 text-sm"
                >
                  <Phone size={15} />
                  Schedule a Visit
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
