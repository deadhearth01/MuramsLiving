"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";

// Gallery items with color themes for placeholder visuals
const galleryItems = [
  { label: "Rooms", color: "from-[#1A2E5A] to-[#2A4A8A]", span: "col-span-1 row-span-2" },
  { label: "Dining Area", color: "from-[#E8601C] to-[#F4845F]", span: "col-span-1 row-span-1" },
  { label: "Terrace View", color: "from-[#0F1C38] to-[#1A2E5A]", span: "col-span-1 row-span-1" },
  { label: "Common Area", color: "from-[#C44E0E] to-[#E8601C]", span: "col-span-2 row-span-1" },
  { label: "Security Area", color: "from-[#1A2E5A] to-[#0F1C38]", span: "col-span-1 row-span-1" },
  { label: "Kitchen", color: "from-[#F4845F] to-[#E8601C]", span: "col-span-1 row-span-1" },
];

export default function GalleryPreview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionTitle
          eyebrow="Photo Gallery"
          title="A Glimpse of "
          highlight="Murams Living"
          description="Take a virtual tour of our premium accommodation facilities, rooms, and beautiful surroundings."
          centered
        />

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 grid-rows-3 gap-3 md:gap-4 h-[400px] md:h-[520px]"
        >
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className={`gallery-placeholder relative overflow-hidden rounded-xl cursor-pointer group ${item.span}`}
              style={{
                background: `linear-gradient(135deg, ${item.color.split(" ")[0].replace("from-[", "").replace("]", "")} 0%, ${item.color.split(" ")[1].replace("to-[", "").replace("]", "")} 100%)`,
              }}
            >
              <div
                className={`w-full h-full bg-gradient-to-br ${item.color} flex items-end p-3`}
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-3 py-1.5 rounded-full">
                    View
                  </span>
                </div>
                {/* Label */}
                <span className="relative z-10 text-white/80 text-xs font-medium bg-black/20 px-2 py-1 rounded-full">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <Link href="/gallery" className="btn-primary inline-flex">
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
