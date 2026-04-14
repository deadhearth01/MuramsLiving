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
  Sun,
  Sparkles,
  WashingMachine,
  Archive,
  Car,
  Tv2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const amenities = [
  {
    icon: Wind,
    title: "Air Conditioning",
    description:
      "Climate-controlled rooms for your comfort in all seasons. Choose AC or Non-AC rooms based on your preference.",
    color: "bg-sky-50 text-sky-600",
    accentColor: "bg-sky-500",
  },
  {
    icon: Wifi,
    title: "Free Wifi",
    description:
      "Unlimited high-speed internet access throughout the property. Reliable connectivity for work and study.",
    color: "bg-violet-50 text-violet-600",
    accentColor: "bg-violet-500",
  },
  {
    icon: UtensilsCrossed,
    title: "Home-Cooked Meals",
    description:
      "Nutritious breakfast, lunch & dinner served fresh every day. Just like home, only better.",
    color: "bg-orange-50 text-orange-600",
    accentColor: "bg-orange-500",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description:
      "Round-the-clock CCTV surveillance, biometric entry, and trained security guards for your peace of mind.",
    color: "bg-emerald-50 text-emerald-600",
    accentColor: "bg-emerald-500",
  },
  {
    icon: Moon,
    title: "Premium Beds",
    description:
      "Quality mattresses, pillows and bedding for truly restful sleep. Wake up refreshed every morning.",
    color: "bg-indigo-50 text-indigo-600",
    accentColor: "bg-indigo-500",
  },
  {
    icon: Sunset,
    title: "Beach View Terrace",
    description:
      "Stunning rooftop terrace with panoramic views of Rushikonda Beach. Perfect for evenings and weekend unwinding.",
    color: "bg-amber-50 text-amber-600",
    accentColor: "bg-amber-500",
  },
  {
    icon: Sun,
    title: "Hot Water 24/7",
    description:
      "Solar-powered hot water system ensures you always have hot water, day or night, without any wait.",
    color: "bg-rose-50 text-rose-600",
    accentColor: "bg-rose-500",
  },
  {
    icon: Sparkles,
    title: "Daily Housekeeping",
    description:
      "Professional housekeeping staff maintains your room and common areas daily to the highest standards.",
    color: "bg-teal-50 text-teal-600",
    accentColor: "bg-teal-500",
  },
  {
    icon: WashingMachine,
    title: "Laundry Service",
    description:
      "Washing machine access for residents. Get your laundry done without stepping outside the property.",
    color: "bg-cyan-50 text-cyan-600",
    accentColor: "bg-cyan-500",
  },
  {
    icon: Archive,
    title: "Personal Storage",
    description:
      "Individual lockable cupboards and storage space for each resident. Keep your belongings safe and organized.",
    color: "bg-fuchsia-50 text-fuchsia-600",
    accentColor: "bg-fuchsia-500",
  },
  {
    icon: Tv2,
    title: "Common TV Lounge",
    description:
      "Comfortable common lounge with television for entertainment and relaxation after a long day.",
    color: "bg-pink-50 text-pink-600",
    accentColor: "bg-pink-500",
  },
  {
    icon: Car,
    title: "Bike Parking",
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
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-navy/3 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: Header + dots nav ───────────────────────── */}
          <AnimatedSection animation="fadeRight">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              Premium Amenities
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy mb-5 leading-tight">
              Everything you need,
              <br />
              <span className="text-primary">thoughtfully</span> included.
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-lg">
              We&apos;ve designed our space around what actually matters for
              comfortable, productive day-to-day living — no extras, no
              compromises.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: "21+", label: "Amenities" },
                { value: "24/7", label: "Hot Water & Security" },
                { value: "3×", label: "Meals per day" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-surface-secondary rounded-2xl p-4 text-center"
                >
                  <div className="font-heading font-bold text-2xl text-primary mb-0.5">
                    {s.value}
                  </div>
                  <div className="text-text-muted text-xs leading-snug">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Amenity dot grid navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {amenities.map((a, i) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.title}
                    onClick={() => goTo(i)}
                    title={a.title}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      i === activeIndex
                        ? "bg-primary text-white shadow-md shadow-primary/30 scale-110"
                        : "bg-surface-secondary text-text-secondary hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Icon size={15} />
                  </button>
                );
              })}
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
          <div className="relative">
            {/* Main card */}
            <div className="relative rounded-3xl overflow-hidden bg-navy-dark shadow-2xl min-h-[420px] lg:min-h-[480px] flex flex-col">
              {/* Placeholder image area */}
              <div className="relative h-52 overflow-hidden flex-shrink-0">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`img-${activeIndex}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute inset-0 flex items-center justify-center ${active.color.split(" ")[0]} bg-opacity-20`}
                    style={{
                      background:
                        "linear-gradient(135deg, #1A2E5A 0%, #0d1c3a 100%)",
                    }}
                  >
                    {/* Decorative icon placeholder until real images are added */}
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <active.icon size={80} className="text-white" />
                    </div>
                    {/* Gradient overlay bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent" />
                    {/* Index badge */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white/60 text-xs px-2.5 py-1 rounded-full">
                      {activeIndex + 1} / {amenities.length}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Amenity info */}
              <div className="flex-1 p-7 relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`info-${activeIndex}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 p-7"
                  >
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${active.color}`}
                    >
                      <active.icon size={14} />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {active.title}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-white mb-3 leading-tight">
                      {active.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {active.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Nav arrows */}
              <div className="absolute bottom-6 right-6 flex gap-2 z-10">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white"
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
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
