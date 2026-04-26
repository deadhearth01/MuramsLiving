"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Images } from "lucide-react";

const featured = [
  { src: "/clicks/gold-building/exterior-front-view-vertical.png", label: "Gold Building", tag: "Exterior" },
  { src: "/clicks/gold-building/dining-horizontal.png",            label: "Dining Area",   tag: "Common Areas" },
  { src: "/clicks/gold-building/2-beds.png",                       label: "2-Bed Room",    tag: "Rooms" },
  { src: "/clicks/gold-building/3-bed.png",                        label: "3-Bed Room",    tag: "Rooms" },
  { src: "/clicks/gold-building/washroom-vertical.png",            label: "Washroom",      tag: "Facilities" },
];

const strip = [
  { src: "/clicks/gold-building/front-side-view.png",         label: "Front View",       tag: "Exterior" },
  { src: "/clicks/gold-building/outer-view-entrance-gate.png",label: "Entrance Gate",    tag: "Exterior" },
  { src: "/clicks/gold-building/outside-image.png",           label: "Outside View",     tag: "Exterior" },
  { src: "/clicks/gold-building/dining-horizontal2.png",      label: "Dining Area",      tag: "Common Areas" },
  { src: "/clicks/gold-building/common-area-steps.png",       label: "Common Area",      tag: "Common Areas" },
  { src: "/clicks/gold-building/solar-water-heater.png",      label: "Solar Heater",     tag: "Facilities" },
  { src: "/clicks/silver-building/outside-view.png",          label: "Silver Building",  tag: "Exterior" },
  { src: "/clicks/silver-building/3-sharing.png",             label: "3-Sharing Room",   tag: "Rooms" },
  { src: "/clicks/silver-building/washroom.png",              label: "Washroom",         tag: "Facilities" },
  { src: "/clicks/IMG_0384.jpg",                              label: "Photo",            tag: "Gallery" },
  { src: "/clicks/IMG_0388.jpg",                              label: "Photo",            tag: "Gallery" },
  { src: "/clicks/IMG_0390.jpg",                              label: "Photo",            tag: "Gallery" },
  { src: "/clicks/IMG_0392.jpg",                              label: "Photo",            tag: "Gallery" },
  { src: "/clicks/IMG_0396.jpg",                              label: "Photo",            tag: "Gallery" },
];

interface GalleryItem { src: string; label: string; tag: string; }

// Small card (right 2×2 and thumbnails)
function SmallCard({
  item, index, isActive, onClick,
}: { item: GalleryItem; index: number; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full h-full overflow-hidden rounded-2xl group cursor-pointer transition-all duration-200 ${
        isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-[#0d1828]" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <Image
        src={item.src}
        alt={item.label}
        fill
        sizes="(max-width: 1024px) 50vw, 25vw"
        className={`object-cover transition-transform duration-700 ${hovered ? "scale-[1.08]" : "scale-100"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${hovered || isActive ? "opacity-100" : "opacity-0"}`} />
      <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm text-white border border-white/20 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
        {item.tag}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className={`block text-white font-semibold text-sm transition-all duration-300 ${hovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-80"}`}>
          {item.label}
        </span>
      </div>
      {isActive && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(232,96,28,0.7)]">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
      )}
    </motion.button>
  );
}

export default function GalleryPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeImage, setActiveImage] = useState<GalleryItem>(featured[0]);

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#0d1828] relative overflow-hidden">
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

        {/* Main grid */}
        {isInView && (
          <div className="grid grid-cols-12 grid-rows-2 gap-3 lg:gap-4" style={{ height: "520px" }}>

            {/* Hero image — crossfades on selection */}
            <div className="col-span-12 lg:col-span-7 row-span-2 relative overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage.src}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeImage.src}
                    alt={activeImage.label}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
              {/* Label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`label-${activeImage.src}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-0 left-0 right-0 p-5 z-20"
                >
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm text-white border border-white/20 mb-2">
                    {activeImage.tag}
                  </span>
                  <p className="text-white font-semibold text-base">{activeImage.label}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right 2×2 — click to update hero */}
            <div className="hidden lg:block lg:col-span-5 row-span-1">
              <div className="grid grid-cols-2 gap-3 lg:gap-4 h-full">
                <SmallCard item={featured[1]} index={1} isActive={activeImage.src === featured[1].src} onClick={() => setActiveImage(featured[1])} />
                <SmallCard item={featured[2]} index={2} isActive={activeImage.src === featured[2].src} onClick={() => setActiveImage(featured[2])} />
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-5 row-span-1">
              <div className="grid grid-cols-2 gap-3 lg:gap-4 h-full">
                <SmallCard item={featured[3]} index={3} isActive={activeImage.src === featured[3].src} onClick={() => setActiveImage(featured[3])} />
                <SmallCard item={featured[4]} index={4} isActive={activeImage.src === featured[4].src} onClick={() => setActiveImage(featured[4])} />
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
          {strip.map((item, i) => {
            const isActive = activeImage.src === item.src;
            return (
              <button
                key={item.src}
                onClick={() => setActiveImage(item)}
                className={`relative flex-shrink-0 w-28 h-20 lg:w-36 lg:h-24 rounded-xl overflow-hidden group cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-[#0d1828] scale-[0.96]"
                    : "hover:scale-[0.97]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 rounded-xl transition-colors duration-300 ${
                  isActive ? "bg-primary/25" : "bg-black/20 group-hover:bg-black/5"
                }`} />
                {isActive && (
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(232,96,28,0.9)]" />
                )}
              </button>
            );
          })}

          {/* End cap */}
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
