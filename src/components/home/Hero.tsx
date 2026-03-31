"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { Phone, ChevronDown } from "lucide-react";

gsap.registerPlugin();

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          subtitleRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          ctaRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          badgesRef.current?.children ?? [],
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 45%, #2A1A0E 80%, #3A1505 100%)",
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large circle top right */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #E8601C 0%, transparent 70%)",
          }}
        />
        {/* Large circle bottom left */}
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #F4845F 0%, transparent 70%)",
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Animated orange accent line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 rounded-r-full"
          style={{ background: "linear-gradient(180deg, transparent, #E8601C, transparent)" }}
        />
      </div>

      {/* Hero overlay gradient */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 container-custom text-center px-4">
        {/* Eyebrow badge */}
        <div ref={badgesRef} className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 bg-[#E8601C]/20 border border-[#E8601C]/30 text-[#F4845F] text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8601C] animate-pulse" />
            Now Accepting New Residents
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
            Rushikonda, Visakhapatnam
          </span>
        </div>

        <h1
          ref={headingRef}
          className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-6 max-w-5xl mx-auto"
        >
          The Perfect{" "}
          <span className="gradient-text">Home-like</span>
          <br className="hidden sm:block" />
          PG &amp; Hostel Stay
          <br />
          <span className="text-white/80 text-3xl md:text-4xl lg:text-5xl">
            in Rushikonda, Visakhapatnam
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-white/80 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Experience premium living with fully furnished rooms, home-cooked
          meals, 24/7 security &amp; stunning beach views — all in one place.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="tel:+917816055655"
            className="flex items-center gap-2 bg-[#E8601C] hover:bg-[#C44E0E] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 text-base shadow-lg shadow-[#E8601C]/30 hover:shadow-[#E8601C]/50 hover:-translate-y-1"
          >
            <Phone size={18} />
            CALL US TO BOOK NOW
          </a>
          <Link
            href="/contact"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-base backdrop-blur-sm hover:-translate-y-1"
          >
            Enquire Now
          </Link>
        </div>

        {/* Quick stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { value: "3+", label: "Room Types" },
            { value: "10+", label: "Amenities" },
            { value: "24/7", label: "Security" },
            { value: "1km", label: "To Beach" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl py-3 px-2"
            >
              <div className="font-heading font-bold text-2xl text-[#E8601C]">
                {stat.value}
              </div>
              <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs animate-bounce">
        <span>Scroll to explore</span>
        <ChevronDown size={18} />
      </div>
    </section>
  );
}
