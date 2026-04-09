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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-10 ${centered ? "text-center" : ""}`}
    >
      {eyebrow && (
        <p
          className={`font-semibold text-sm uppercase tracking-[0.15em] mb-4 ${
            light ? "text-white/70" : "text-primary"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {highlight ? (
          <>
            {title}
            {highlight}
          </>
        ) : (
          title
        )}
      </h2>
      {description && (
        <p
          className={`text-base md:text-lg leading-relaxed max-w-2xl ${
            centered ? "mx-auto" : ""
          } ${light ? "text-white/70" : "text-text-secondary"}`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
