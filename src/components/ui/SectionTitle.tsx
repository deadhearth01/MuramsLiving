"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  highlight,
  description,
  centered = false,
  light = false,
}: SectionTitleProps) {
  const titleParts = highlight ? title.split(highlight) : [title];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-10 ${centered ? "text-center" : ""}`}
    >
      {eyebrow && (
        <span
          className={`inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full ${
            light
              ? "bg-white/20 text-white"
              : "bg-[#E8601C]/10 text-[#E8601C]"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${
          light ? "text-white" : "text-[#1A2E5A]"
        }`}
      >
        {highlight ? (
          <>
            {titleParts[0]}
            <span className="gradient-text">{highlight}</span>
            {titleParts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {description && (
        <p
          className={`text-base md:text-lg leading-relaxed max-w-2xl ${
            centered ? "mx-auto" : ""
          } ${light ? "text-white/80" : "text-gray-600"}`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
