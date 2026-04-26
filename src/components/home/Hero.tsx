"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight } from "lucide-react";

const slides = [
  { src: "/clicks/gold-building/exterior-front-view-vertical.png", label: "Gold Building" },
  { src: "/clicks/gold-building/dining-horizontal.png",            label: "Dining Area" },
  { src: "/clicks/gold-building/2-beds.png",                       label: "2-Bed Room" },
  { src: "/clicks/gold-building/front-side-view.png",              label: "Building Front" },
  { src: "/clicks/gold-building/3-bed.png",                        label: "3-Bed Room" },
  { src: "/clicks/gold-building/dining-horizontal2.png",           label: "Common Dining" },
  { src: "/clicks/gold-building/outer-view-entrance-gate.png",     label: "Entrance Gate" },
  { src: "/clicks/gold-building/common-area-steps.png",            label: "Common Area" },
  { src: "/clicks/gold-building/exterior-side-view-vertical.png",  label: "Side View" },
];

const INTERVAL = 5000;

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-navy-dark">

      {/* Photo slideshow — all slides stacked, preloaded for instant swaps */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              opacity: i === current ? 1 : 0,
              scale: i === current ? 1 : 1.06,
            }}
            transition={{
              opacity: { duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] },
              scale: { duration: 6, ease: "linear" },
            }}
            className="absolute inset-0"
            style={{ zIndex: i === current ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.label}
              fill
              priority={i < 3}
              loading={i < 3 ? undefined : "eager"}
              className="object-cover"
              sizes="100vw"
              quality={65}
            />
          </motion.div>
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

        {/* Curved black mask — bezier curve top edge, fades to solid at bottom */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
          style={{ height: "72%" }}
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="black" stopOpacity="0"    />
              <stop offset="40%"  stopColor="black" stopOpacity="0.72" />
              <stop offset="100%" stopColor="black" stopOpacity="0.94" />
            </linearGradient>
          </defs>
          {/* Curve: rises to peak at centre (720,70), drops back at edges */}
          <path
            d="M0,210 Q720,70 1440,210 L1440,600 L0,600 Z"
            fill="url(#curveGrad)"
          />
        </svg>

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Dot + label indicator — bottom-center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none">
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === current ? 24 : 6, opacity: i === current ? 1 : 0.4 }}
              transition={{ duration: 0.35 }}
              className="h-1.5 rounded-full bg-white"
            />
          ))}
        </div>
      </div>

      {/* Bottom-left content */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-0 left-0 z-10 w-full px-6 sm:px-10 lg:px-16 pb-28 sm:pb-32"
          >
            <div className="max-w-2xl">
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3">
                Rushikonda, Visakhapatnam
              </p>

              <h1 className="font-heading text-white font-bold tracking-tight leading-[1.1] text-4xl sm:text-5xl lg:text-6xl mb-5" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.6)" }}>
                The Perfect<br />Home-like Stay
              </h1>

              <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>
                Fully furnished rooms, home-cooked meals, 24/7 security &amp;
                stunning beach views in the heart of Rushikonda.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
                <a
                  href="tel:+917816055655"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-7 rounded-xl transition-all duration-300 text-sm shadow-lg shadow-primary/30"
                >
                  <Phone size={17} />
                  Call to Book
                </a>
                <Link
                  href="/book"
                  className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold py-3.5 px-7 rounded-xl transition-all duration-300 text-sm backdrop-blur-sm"
                >
                  Book Online
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Reviews Badge */}
      <AnimatePresence>
        {isLoaded && (
          <motion.a
            href="https://maps.app.goo.gl/sb63eA3F1TU4m9NJA"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="hidden sm:flex absolute bottom-28 sm:bottom-32 right-6 sm:right-10 lg:right-16 z-20 items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-white/50 hover:bg-white transition-all duration-300 cursor-pointer"
          >
            <div className="bg-white rounded-xl p-1.5 flex-shrink-0 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider leading-none mb-1">Google Reviews</p>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-900 font-bold text-sm leading-none">4.6</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
                  <span className="text-amber-400 text-xs opacity-60">★</span>
                </div>
              </div>
              <p className="text-gray-400 text-[10px] mt-0.5">See all reviews →</p>
            </div>
          </motion.a>
        )}
      </AnimatePresence>
    </section>
  );
}
