"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const galleryItems = [
  {
    id: 1,
    label: "Beach View",
    category: "Views",
    src: "/clicks/077b49fa-bcf4-4a4b-b13d-c97087b50380.JPG",
    colSpan: "col-span-2",
    rowSpan: "row-span-2",
  },
  {
    id: 2,
    label: "Premium Room",
    category: "Rooms",
    src: "/clicks/4350f887-b2b6-4241-8c50-027772939d25.JPG",
    colSpan: "col-span-2",
    rowSpan: "row-span-1",
  },
  {
    id: 3,
    label: "Common Area",
    category: "Common",
    src: "/clicks/IMG_0383.jpg",
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    id: 4,
    label: "Room Interior",
    category: "Rooms",
    src: "/clicks/IMG_0384.jpg",
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    id: 5,
    label: "Living Space",
    category: "Common",
    src: "/clicks/IMG_0385.jpg",
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    id: 6,
    label: "Amenities",
    category: "Amenities",
    src: "/clicks/IMG_0386.jpg",
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
];

export default function GalleryPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-navy-dark relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <AnimatedSection className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              Photo Gallery
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">
              See Murams Living for yourself.
            </h2>
            <p className="text-white/55 text-lg">
              A look inside our rooms, common areas, and the views that make
              every day feel worth coming home to.
            </p>
          </div>

          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 text-white hover:text-primary font-semibold transition-colors shrink-0"
          >
            <span>View Full Gallery</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>

        {/* Bento Grid */}
        <div className="grid grid-cols-4 gap-3 lg:gap-4" style={{ gridAutoRows: "200px" }}>
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.08, duration: 0.6 }}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer ${item.colSpan} ${item.rowSpan}`}
            >
              <img
                src={item.src}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-all duration-300" />
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <span className="text-xs text-white/60 uppercase tracking-wider block">{item.category}</span>
                <span className="text-white font-semibold text-sm">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.3} className="text-center mt-12">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-primary/25"
          >
            <span>Explore Full Gallery</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
