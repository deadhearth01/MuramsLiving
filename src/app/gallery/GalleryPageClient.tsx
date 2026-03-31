"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

const categories = ["All", "Rooms", "Common Areas", "Dining", "Terrace", "Exterior"];

const galleryItems = [
  { id: 1, title: "Double Occupancy Room", category: "Rooms", color: "from-[#1A2E5A] to-[#2A4A8A]", span: "col-span-2 row-span-2" },
  { id: 2, title: "Triple Occupancy Room", category: "Rooms", color: "from-[#0F1C38] to-[#1A2E5A]", span: "col-span-1 row-span-1" },
  { id: 3, title: "Room View", category: "Rooms", color: "from-[#1A2E5A] to-[#0F1C38]", span: "col-span-1 row-span-1" },
  { id: 4, title: "Dining Hall", category: "Dining", color: "from-[#E8601C] to-[#F4845F]", span: "col-span-2 row-span-1" },
  { id: 5, title: "Kitchen Area", category: "Dining", color: "from-[#C44E0E] to-[#E8601C]", span: "col-span-1 row-span-2" },
  { id: 6, title: "Common Lounge", category: "Common Areas", color: "from-[#2A4A8A] to-[#1A2E5A]", span: "col-span-1 row-span-1" },
  { id: 7, title: "Study Area", category: "Common Areas", color: "from-[#1A2E5A] to-[#2A6049]", span: "col-span-1 row-span-1" },
  { id: 8, title: "Beach View Terrace", category: "Terrace", color: "from-[#E8601C] to-[#1A2E5A]", span: "col-span-2 row-span-2" },
  { id: 9, title: "Terrace Evening View", category: "Terrace", color: "from-[#F4845F] to-[#E8601C]", span: "col-span-1 row-span-1" },
  { id: 10, title: "Building Exterior", category: "Exterior", color: "from-[#0F1C38] to-[#2A4A8A]", span: "col-span-1 row-span-1" },
  { id: 11, title: "Entrance", category: "Exterior", color: "from-[#1A2E5A] to-[#E8601C]", span: "col-span-1 row-span-1" },
  { id: 12, title: "Parking Area", category: "Exterior", color: "from-[#2A4A8A] to-[#1A2E5A]", span: "col-span-1 row-span-1" },
];

export default function GalleryPageClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<(typeof galleryItems)[0] | null>(null);

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 50%, #2A1A0E 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#E8601C]" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#F4845F]" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-[#E8601C]/20 border border-[#E8601C]/30 text-[#F4845F] text-xs font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            Visual Tour
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4"
          >
            Photo{" "}
            <span className="gradient-text">Gallery</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Take a virtual tour of our premium facilities, rooms, and beautiful
            surroundings at Murams Living.
          </motion.p>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#E8601C] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-[#E8601C]/10 hover:text-[#E8601C]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="break-inside-avoid mb-4 cursor-pointer group"
                  onClick={() => setSelectedItem(item)}
                >
                  <div
                    className={`relative rounded-xl overflow-hidden ${
                      index % 3 === 0 ? "h-64" : index % 3 === 1 ? "h-48" : "h-56"
                    } bg-gradient-to-br ${item.color}`}
                  >
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2 text-white">
                        <ZoomIn size={28} />
                        <span className="text-sm font-medium">View</span>
                      </div>
                    </div>
                    {/* Label */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <span className="text-white/70 text-xs">{item.category}</span>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-4xl font-bold text-white/10">
                      ML
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              No photos in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`h-80 md:h-96 w-full bg-gradient-to-br ${selectedItem.color} flex items-center justify-center`}
              >
                <div className="text-center text-white">
                  <div className="font-heading text-6xl font-bold opacity-20">ML</div>
                  <p className="text-white/70 text-sm mt-4">{selectedItem.title}</p>
                </div>
              </div>
              <div className="bg-white p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-[#1A2E5A]">
                    {selectedItem.title}
                  </h3>
                  <span className="text-[#E8601C] text-xs">{selectedItem.category}</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-16 bg-[#FFF8F5]">
        <div className="container-custom text-center">
          <h2 className="font-heading font-bold text-3xl text-[#1A2E5A] mb-4">
            Want to See More?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Visit us in person and experience Murams Living for yourself. We
            offer free guided tours of our facilities.
          </p>
          <a href="tel:+917816055655" className="btn-primary inline-flex">
            Schedule a Visit
          </a>
        </div>
      </section>
    </div>
  );
}
