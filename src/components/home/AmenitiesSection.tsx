"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind,
  Wifi,
  UtensilsCrossed,
  Shield,
  Moon,
  Sunset,
  Sparkles,
  WashingMachine,
  Car,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const amenities = [
  {
    icon: Wind,
    title: "Air Conditioning",
    image: "/Amenities/ac.webp",
    description:
      "Climate-controlled rooms for your comfort in all seasons. Choose AC or Non-AC rooms based on your preference.",
    color: "bg-sky-50 text-sky-600",
    accentColor: "bg-sky-500",
  },
  {
    icon: Wifi,
    title: "Free Wifi",
    image: "/Amenities/wifi.avif",
    description:
      "Unlimited high-speed internet access throughout the property. Reliable connectivity for work and study.",
    color: "bg-violet-50 text-violet-600",
    accentColor: "bg-violet-500",
  },
  {
    icon: UtensilsCrossed,
    title: "Home-Cooked Meals",
    image: "/Amenities/home-food.jpg",
    description:
      "Nutritious breakfast, lunch & dinner served fresh every day. Just like home, only better.",
    color: "bg-orange-50 text-orange-600",
    accentColor: "bg-orange-500",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    image: "/Amenities/security-camera.webp",
    description:
      "Round-the-clock CCTV surveillance, biometric entry, and trained security guards for your peace of mind.",
    color: "bg-emerald-50 text-emerald-600",
    accentColor: "bg-emerald-500",
  },
  {
    icon: Moon,
    title: "Premium Beds",
    image: "/Amenities/beds.png",
    description:
      "Quality mattresses, pillows and bedding for truly restful sleep. Wake up refreshed every morning.",
    color: "bg-indigo-50 text-indigo-600",
    accentColor: "bg-indigo-500",
  },
  {
    icon: Sunset,
    title: "Beach View Terrace",
    image: "/Amenities/beach-view.jpeg",
    description:
      "Stunning rooftop terrace with panoramic views of Rushikonda Beach. Perfect for evenings and weekend unwinding.",
    color: "bg-amber-50 text-amber-600",
    accentColor: "bg-amber-500",
  },
  {
    icon: Sparkles,
    title: "Daily Housekeeping",
    image: "/Amenities/house-cleaning.jpg",
    description:
      "Professional housekeeping staff maintains your room and common areas daily to the highest standards.",
    color: "bg-teal-50 text-teal-600",
    accentColor: "bg-teal-500",
  },
  {
    icon: WashingMachine,
    title: "Laundry Service",
    image: "/Amenities/laundry-services.jpg",
    description:
      "Washing machine access for residents. Get your laundry done without stepping outside the property.",
    color: "bg-cyan-50 text-cyan-600",
    accentColor: "bg-cyan-500",
  },
  {
    icon: Car,
    title: "Bike Parking",
    image: "/Amenities/bike-parking.avif",
    description:
      "Dedicated two-wheeler parking space within the premises. Secure and conveniently located.",
    color: "bg-stone-100 text-stone-600",
    accentColor: "bg-stone-500",
  },
];

const AUTO_ADVANCE_MS = 3000;

export default function AmenitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % amenities.length);
    }, AUTO_ADVANCE_MS);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    startTimer();
  };

  const prev = () => {
    const next = (activeIndex - 1 + amenities.length) % amenities.length;
    setDirection(-1);
    setActiveIndex(next);
    startTimer();
  };

  const next = () => {
    const nextIdx = (activeIndex + 1) % amenities.length;
    setDirection(1);
    setActiveIndex(nextIdx);
    startTimer();
  };

  const active = amenities[activeIndex];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section className="py-14 lg:py-32 bg-white relative overflow-x-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-navy/3 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* ── Left: Header + dots nav ───────────────────────── */}
          <AnimatedSection animation="fadeUp" className="min-w-0">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              Premium Amenities
            </p>
            <h2 className="font-heading text-3xl lg:text-5xl font-bold text-navy mb-4 leading-tight">
              Everything you need,
              <br />
              <span className="text-primary">thoughtfully</span> included.
            </h2>
            <p className="text-text-secondary text-base lg:text-lg mb-6 max-w-lg">
              We&apos;ve designed our space around what actually matters for
              comfortable, productive day-to-day living — no extras, no
              compromises.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
              {[
                { value: "21+", label: "Amenities" },
                { value: "24/7", label: "Security & Hot Water" },
                { value: "3×", label: "Meals per day" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-surface-secondary rounded-2xl p-4 text-center"
                >
                  <div className="font-heading font-bold text-xl sm:text-2xl text-primary mb-0.5">
                    {s.value}
                  </div>
                  <div className="text-text-muted text-xs leading-snug">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/amenities"
              className="group inline-flex items-center gap-2 text-navy hover:text-primary font-semibold transition-colors text-sm"
            >
              <span>View All Amenities</span>
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </AnimatedSection>

          {/* ── Right: Amenity card slider ────────────────────── */}
          <div className="relative w-full min-w-0">
            {/* Main card — full-bleed image with overlaid text */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[360px] sm:h-[460px] lg:h-[500px]">
              {/* Full-bleed image */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`img-${activeIndex}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient overlay — bottom-heavy for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 z-10" />

              {/* Index badge — top right */}
              <div className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-sm text-white/70 text-xs px-3 py-1 rounded-full">
                {activeIndex + 1} / {amenities.length}
              </div>

              {/* Text content overlaid at bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-7 pb-10 sm:pb-12">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`info-${activeIndex}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 ${active.color}`}>
                      <active.icon size={13} />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {active.title}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-2 leading-tight">
                      {active.title}
                    </h3>
                    <p className="text-white/75 text-sm leading-relaxed max-w-sm">
                      {active.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Nav arrows — bottom right above progress */}
              <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex gap-2 z-30">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-all text-white"
                  aria-label="Previous amenity"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center transition-all text-white shadow-sm"
                  aria-label="Next amenity"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-30">
                <motion.div
                  key={activeIndex}
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: AUTO_ADVANCE_MS / 1000,
                    ease: "linear",
                  }}
                />
              </div>
            </div>

            {/* Mini thumbnails row */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {amenities.map((a, i) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.title}
                    onClick={() => goTo(i)}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 border-2 ${
                      i === activeIndex
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-100 bg-white text-text-secondary hover:border-primary/30"
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
