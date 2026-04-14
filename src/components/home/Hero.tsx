"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight } from "lucide-react";

const videos = [
  "/clicks/IMG_0467.MOV",
  "/clicks/IMG_0468.MOV",
  "/clicks/IMG_0469.MOV",
  "/clicks/IMG_0453.MOV",
  "/clicks/IMG_0454.MOV"
];

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-navy-dark">
      {/* Background Video Slideshow */}
      <div className="absolute inset-0 z-0 bg-navy-dark">
        <AnimatePresence initial={false}>
          <motion.video
            key={currentVideo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videos[currentVideo]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Bottom-left content */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-0 left-0 z-10 w-full px-6 sm:px-10 lg:px-16 pb-20 sm:pb-24"
          >
            <div className="max-w-2xl">
              {/* Location label */}
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3">
                Rushikonda, Visakhapatnam
              </p>

              <h1 className="font-heading text-white font-bold tracking-tight leading-[1.1] drop-shadow-xl text-4xl sm:text-5xl lg:text-6xl mb-5">
                The Perfect<br />Home-like Stay
              </h1>

              <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                Fully furnished rooms, home-cooked meals, 24/7 security &
                stunning beach views in the heart of Rushikonda.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3">
                <a
                  href="tel:+917816055655"
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-7 rounded-xl transition-all duration-300 text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50"
                >
                  <Phone size={17} />
                  Call to Book
                </a>
                <Link
                  href="/book"
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold py-3.5 px-7 rounded-xl transition-all duration-300 text-sm backdrop-blur-sm"
                >
                  Book Online
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Reviews Badge — bottom-right, always visible */}
      <AnimatePresence>
        {isLoaded && (
          <motion.a
            href="https://maps.app.goo.gl/4nWFLswApRBM9YB87"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="absolute bottom-20 sm:bottom-24 right-6 sm:right-10 lg:right-16 z-20 flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-white/50 hover:bg-white transition-all duration-300 cursor-pointer group"
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

      {/* Scroll indicator */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-1.5 rounded-full bg-white/60" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
