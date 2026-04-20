"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Phone } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

type Building = "gold" | "silver";

const categories = ["All", "Rooms", "Common Areas", "Views", "Exterior"];

const galleryItems = [
  // ── Gold Building ──────────────────────────────────────────────────────────
  { id:  1, src: "/clicks/gold-building/exterior-front-view-vertical.png", title: "Front View",          category: "Exterior",      building: "gold" as Building },
  { id:  2, src: "/clicks/gold-building/exterior-side-view-vertical.png",  title: "Side Exterior",       category: "Exterior",      building: "gold" as Building },
  { id:  3, src: "/clicks/gold-building/front-side-view.png",              title: "Building Frontage",   category: "Exterior",      building: "gold" as Building },
  { id:  4, src: "/clicks/gold-building/outer-view-entrance-gate.png",     title: "Entrance Gate",       category: "Exterior",      building: "gold" as Building },
  { id:  5, src: "/clicks/gold-building/outside-image.png",                title: "Outside View",        category: "Exterior",      building: "gold" as Building },
  { id:  6, src: "/clicks/gold-building/dining-horizontal.png",            title: "Dining Area",         category: "Common Areas",  building: "gold" as Building },
  { id:  7, src: "/clicks/gold-building/dining-horizontal2.png",           title: "Dining Hall",         category: "Common Areas",  building: "gold" as Building },
  { id:  8, src: "/clicks/gold-building/common-area-steps.png",            title: "Common Steps",        category: "Common Areas",  building: "gold" as Building },
  { id:  9, src: "/clicks/gold-building/solar-water-heater.png",           title: "Solar Water Heater",  category: "Common Areas",  building: "gold" as Building },
  { id: 10, src: "/clicks/gold-building/washroom.png",                     title: "Washroom",            category: "Common Areas",  building: "gold" as Building },
  { id: 11, src: "/clicks/gold-building/washroom-vertical.png",            title: "Bathroom View",       category: "Common Areas",  building: "gold" as Building },
  { id: 12, src: "/clicks/gold-building/2-beds.png",                       title: "2-Bed Room",          category: "Rooms",         building: "gold" as Building },
  { id: 13, src: "/clicks/gold-building/3-bed.png",                        title: "3-Bed Room",          category: "Rooms",         building: "gold" as Building },
  { id: 14, src: "/clicks/077b49fa-bcf4-4a4b-b13d-c97087b50380.JPG",      title: "Beach View",          category: "Views",         building: "gold" as Building },
  { id: 15, src: "/clicks/IMG_0384.jpg",                                   title: "Room Interior",       category: "Rooms",         building: "gold" as Building },
  { id: 16, src: "/clicks/IMG_0388.jpg",                                   title: "Room Setup",          category: "Rooms",         building: "gold" as Building },
  { id: 17, src: "/clicks/IMG_0390.jpg",                                   title: "Terrace View",        category: "Views",         building: "gold" as Building },
  { id: 18, src: "/clicks/IMG_0392.jpg",                                   title: "Cozy Room",           category: "Rooms",         building: "gold" as Building },
  { id: 19, src: "/clicks/IMG_0396.jpg",                                   title: "Room Amenities",      category: "Rooms",         building: "gold" as Building },
  { id: 20, src: "/clicks/IMG_0400.jpg",                                   title: "Furnished Room",      category: "Rooms",         building: "gold" as Building },
  { id: 21, src: "/clicks/IMG_0406.jpg",                                   title: "Common Lounge",       category: "Common Areas",  building: "gold" as Building },
  // ── Silver Building ────────────────────────────────────────────────────────
  { id: 22, src: "/clicks/silver-building/outside-view.png",               title: "Silver Building",     category: "Exterior",      building: "silver" as Building },
  { id: 23, src: "/clicks/silver-building/3-sharing.png",                  title: "3-Sharing Room",      category: "Rooms",         building: "silver" as Building },
  { id: 24, src: "/clicks/silver-building/washroom.png",                   title: "Washroom",            category: "Common Areas",  building: "silver" as Building },
  { id: 25, src: "/clicks/IMG_0398.jpg",                                   title: "Evening View",        category: "Views",         building: "silver" as Building },
  { id: 26, src: "/clicks/IMG_0401.jpg",                                   title: "Room Furnishings",    category: "Rooms",         building: "silver" as Building },
  { id: 27, src: "/clicks/IMG_0402.jpg",                                   title: "Hallway",             category: "Common Areas",  building: "silver" as Building },
  { id: 28, src: "/clicks/IMG_0403.jpg",                                   title: "Surroundings",        category: "Views",         building: "silver" as Building },
  { id: 29, src: "/clicks/IMG_0405.jpg",                                   title: "Study Corner",        category: "Rooms",         building: "silver" as Building },
  { id: 30, src: "/clicks/IMG_0408.jpg",                                   title: "Room Detail",         category: "Rooms",         building: "silver" as Building },
  { id: 31, src: "/clicks/IMG_0410.jpg",                                   title: "Building Side",       category: "Exterior",      building: "silver" as Building },
];

const buildingTabs: { key: Building; label: string; icon: string; subtitle: string }[] = [
  { key: "gold",   label: "Gold Building",   icon: "🥇", subtitle: "Original Building" },
  { key: "silver", label: "Silver Building",  icon: "🥈", subtitle: "New Building with Parking" },
];

export default function GalleryPageClient() {
  const [activeBuilding, setActiveBuilding] = useState<Building>("gold");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<(typeof galleryItems)[0] | null>(null);

  const goldCount = galleryItems.filter((i) => i.building === "gold").length;
  const silverCount = galleryItems.filter((i) => i.building === "silver").length;
  const countMap: Record<Building, number> = { gold: goldCount, silver: silverCount };

  const filteredItems = useMemo(() => {
    let items = galleryItems.filter((item) => item.building === activeBuilding);
    if (activeCategory !== "All") {
      items = items.filter((item) => item.category === activeCategory);
    }
    return items;
  }, [activeBuilding, activeCategory]);

  const handleBuildingChange = (b: Building) => {
    setActiveBuilding(b);
    setActiveCategory("All");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <section className="py-20 md:py-28 bg-navy-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container-custom relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">Visual Tour</p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-5 leading-tight">
              Photo Gallery
            </h1>
            <p className="text-white/65 text-lg">
              Take a virtual tour of our premium facilities, rooms, and beautiful surroundings at Murams Living.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-custom">
          {/* Building Tabs */}
          <AnimatedSection className="mb-8">
            <div className="inline-flex rounded-2xl bg-surface-secondary p-1.5 gap-1.5">
              {buildingTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleBuildingChange(tab.key)}
                  className="relative px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors duration-300 flex items-center gap-2.5 min-w-[180px] justify-center"
                >
                  {activeBuilding === tab.key && (
                    <motion.div
                      layoutId="building-pill"
                      className={`absolute inset-0 rounded-xl shadow-lg ${
                        tab.key === "gold"
                          ? "bg-gradient-to-br from-amber-500 to-amber-600"
                          : "bg-gradient-to-br from-slate-500 to-slate-600"
                      }`}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2.5">
                    <span className="text-lg leading-none">{tab.icon}</span>
                    <span className={activeBuilding === tab.key ? "text-white" : "text-text-secondary"}>
                      {tab.label}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center text-xs font-bold rounded-full min-w-[22px] h-[22px] px-1.5 ${
                        activeBuilding === tab.key
                          ? "bg-white/25 text-white"
                          : "bg-surface-tertiary text-text-secondary"
                      }`}
                    >
                      {countMap[tab.key]}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-text-secondary">
              {activeBuilding === "gold"
                ? "Showing photos from the Gold Building — our original, established property."
                : "Showing photos from the Silver Building — our newer property with dedicated parking."}
            </p>
          </AnimatedSection>

          {/* Category Filter */}
          <AnimatedSection className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                    ? "bg-navy text-white shadow-sm"
                    : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary"
                }`}
              >
                {cat}
              </button>
            ))}
          </AnimatedSection>

          {/* Masonry Grid */}
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className="break-inside-avoid mb-4 cursor-pointer group"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-start p-4">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white font-medium text-sm">{item.title}</p>
                        <span className="text-white/70 text-xs">{item.category}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-4 right-4">
                        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <ZoomIn size={16} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 text-text-secondary">No photos in this category.</div>
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
            className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.src}
                alt={selectedItem.title}
                className="w-full h-auto max-h-[80vh] object-contain bg-black"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-medium">{selectedItem.title}</p>
                <span className="text-white/60 text-xs">{selectedItem.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-16 bg-surface-secondary">
        <div className="container-custom text-center max-w-xl mx-auto">
          <AnimatedSection>
            <h2 className="font-heading font-bold text-2xl text-navy mb-3">Want to See It in Person?</h2>
            <p className="text-text-secondary mb-6">
              Visit us in Rushikonda and experience Murams Living for yourself. We offer free guided tours.
            </p>
            <a
              href="tel:+917816055655"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-xl transition-all"
            >
              <Phone size={17} />
              Schedule a Visit
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
