"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Images } from "lucide-react";

const featured = [
  { src: "/clicks/gold-building/exterior-front-view-vertical.png", label: "Gold Building", tag: "Exterior", wide: true },
  { src: "/clicks/gold-building/dining-horizontal.png", label: "Dining Area", tag: "Common Areas", wide: false },
  { src: "/clicks/gold-building/2-beds.png", label: "2-Bed Room", tag: "Rooms", wide: false },
  { src: "/clicks/gold-building/3-bed.png", label: "3-Bed Room", tag: "Rooms", wide: false },
  { src: "/clicks/gold-building/washroom-vertical.png", label: "Washroom", tag: "Facilities", wide: false },
];

const strip = [
  "/clicks/gold-building/front-side-view.png",
  "/clicks/gold-building/outer-view-entrance-gate.png",
  "/clicks/gold-building/outside-image.png",
  "/clicks/gold-building/dining-horizontal2.png",
  "/clicks/gold-building/common-area-steps.png",
  "/clicks/gold-building/solar-water-heater.png",
  "/clicks/silver-building/outside-view.png",
  "/clicks/silver-building/3-sharing.png",
  "/clicks/silver-building/washroom.png",
  "/clicks/IMG_0384.jpg",
  "/clicks/IMG_0388.jpg",
  "/clicks/IMG_0390.jpg",
  "/clicks/IMG_0392.jpg",
  "/clicks/IMG_0396.jpg",
];

function GalleryCard({
  src, label, tag, index, className,
}: { src: string; label: string; tag: string; index: number; className?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={src}
        alt={label}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover transition-transform duration-700 ${hovered ? "scale-108" : "scale-100"}`}
        style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
      />
      {/* base scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      {/* hover scrim */}
      <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`} />
      {/* tag pill */}
      <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm text-white border border-white/20 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
        {tag}
      </div>
      {/* label */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className={`block text-white font-semibold text-sm transition-transform duration-300 ${hovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-80"}`}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}

export default function GalleryPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#0d1828] relative overflow-hidden">
      {/* Subtle radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-primary/4 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              <Images size={13} className="text-primary" />
              <span className="text-primary font-semibold text-xs uppercase tracking-[0.15em]">Photo Gallery</span>
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
              See it. <span className="text-primary">Feel it.</span>
            </h2>
            <p className="text-white/50 text-base lg:text-lg leading-relaxed">
              Real rooms, real views, real life at Murams Living — no filters needed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-4 shrink-0"
          >
            <span className="text-white/35 text-sm hidden lg:block">75+ photos</span>
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-primary hover:border-primary text-white text-sm font-semibold transition-all duration-300"
            >
              View Full Gallery
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Main grid — only renders animations when in view */}
        {isInView && (
          <div className="grid grid-cols-12 grid-rows-2 gap-3 lg:gap-4" style={{ height: "520px" }}>
            {/* Large hero image */}
            <div className="col-span-12 lg:col-span-7 row-span-2">
              <GalleryCard {...featured[0]} index={0} className="w-full h-full" />
            </div>
            {/* Right 2×2 */}
            <div className="hidden lg:block lg:col-span-5 row-span-1">
              <div className="grid grid-cols-2 gap-3 lg:gap-4 h-full">
                <GalleryCard {...featured[1]} index={1} className="h-full" />
                <GalleryCard {...featured[2]} index={2} className="h-full" />
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-5 row-span-1">
              <div className="grid grid-cols-2 gap-3 lg:gap-4 h-full">
                <GalleryCard {...featured[3]} index={3} className="h-full" />
                <GalleryCard {...featured[4]} index={4} className="h-full" />
              </div>
            </div>
          </div>
        )}

        {/* Horizontal scroll strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {strip.map((src, i) => (
            <div
              key={src}
              className="relative flex-shrink-0 w-28 h-20 lg:w-36 lg:h-24 rounded-xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={src}
                alt={`Gallery ${i + 1}`}
                fill
                sizes="160px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 rounded-xl" />
            </div>
          ))}
          {/* End cap — full gallery CTA */}
          <Link
            href="/gallery"
            className="flex-shrink-0 w-28 lg:w-36 h-20 lg:h-24 rounded-xl bg-primary/15 border border-primary/30 flex flex-col items-center justify-center gap-1 hover:bg-primary/25 transition-colors group"
          >
            <Images size={18} className="text-primary" />
            <span className="text-white/70 text-xs font-medium group-hover:text-white transition-colors">All photos</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
