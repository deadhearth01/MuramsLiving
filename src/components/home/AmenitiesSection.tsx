"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Archive,
  Wind,
  Tv,
  Sun,
  UtensilsCrossed,
  WashingMachine,
  Sunset,
  Wifi,
  Shield,
  Car,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const amenities = [
  {
    icon: <Wind size={24} />,
    title: "Air Conditioning",
    description: "Climate-controlled rooms",
    size: "small",
    category: "comfort",
  },
  {
    icon: <Wifi size={24} />,
    title: "High-Speed WiFi",
    description: "Unlimited internet access",
    size: "medium",
    category: "connectivity",
    featured: true,
  },
  {
    icon: <UtensilsCrossed size={24} />,
    title: "Home-Cooked Meals",
    description: "Nutritious breakfast, lunch & dinner",
    size: "large",
    category: "food",
    featured: true,
  },
  {
    icon: <Shield size={24} />,
    title: "24/7 Security",
    description: "CCTV & guards",
    size: "medium",
    category: "safety",
    featured: true,
  },
  {
    icon: <Moon size={24} />,
    title: "Premium Beds",
    description: "Quality mattresses for restful sleep",
    size: "small",
    category: "comfort",
  },
  {
    icon: <Sunset size={24} />,
    title: "Beach View Terrace",
    description: "Stunning rooftop ocean views",
    size: "large",
    category: "experience",
    featured: true,
  },
  {
    icon: <Sun size={24} />,
    title: "Hot Water 24/7",
    description: "Solar-powered system",
    size: "small",
    category: "utilities",
  },
  {
    icon: <Sparkles size={24} />,
    title: "Daily Housekeeping",
    description: "Clean rooms & common areas",
    size: "medium",
    category: "services",
  },
  {
    icon: <WashingMachine size={24} />,
    title: "Laundry Service",
    description: "Washing machine access",
    size: "small",
    category: "services",
  },
  {
    icon: <Archive size={24} />,
    title: "Personal Storage",
    description: "Individual cupboards",
    size: "small",
    category: "comfort",
  },
  {
    icon: <Tv size={24} />,
    title: "Entertainment",
    description: "TV in common areas",
    size: "small",
    category: "entertainment",
  },
  {
    icon: <Car size={24} />,
    title: "Parking Space",
    description: "For two-wheelers",
    size: "small",
    category: "facilities",
  },
];

export default function AmenitiesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 lg:py-32 bg-surface-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-navy/3 rounded-full blur-[80px] -translate-x-1/2" />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <AnimatedSection className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              Premium Amenities
            </p>

            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy mb-4">
              Everything you need, thoughtfully included.
            </h2>

            <p className="text-text-secondary text-lg">
              We've designed our space around what actually matters for
              comfortable, productive day-to-day living.
            </p>
          </div>
          
          <Link
            href="/amenities"
            className="group inline-flex items-center gap-2 text-navy hover:text-primary font-semibold transition-colors shrink-0"
          >
            <span>View All Amenities</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5">
          {amenities.map((amenity, index) => {
            // Determine grid span based on size
            const spanClass = 
              amenity.size === "large" 
                ? "col-span-2 row-span-2" 
                : amenity.size === "medium" 
                  ? "col-span-2" 
                  : "col-span-1";
            
            return (
              <motion.div
                key={amenity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={`
                  relative group rounded-2xl lg:rounded-3xl p-5 lg:p-6
                  ${spanClass}
                  ${amenity.featured 
                    ? "bg-gradient-to-br from-navy via-navy-dark to-navy text-white" 
                    : "bg-white border border-gray-100 hover:border-primary/20"
                  }
                  transition-all duration-300 cursor-default
                  hover:shadow-soft hover:-translate-y-1
                `}
              >
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4
                  ${amenity.featured 
                    ? "bg-white/10 text-primary-light" 
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                  }
                  transition-all duration-300
                `}>
                  {amenity.icon}
                </div>
                
                {/* Content */}
                <h3 className={`
                  font-heading font-bold text-base lg:text-lg mb-1
                  ${amenity.featured ? "text-white" : "text-navy"}
                `}>
                  {amenity.title}
                </h3>
                
                <p className={`
                  text-sm leading-relaxed
                  ${amenity.featured ? "text-white/70" : "text-text-muted"}
                  ${amenity.size === "small" ? "hidden sm:block" : ""}
                `}>
                  {amenity.description}
                </p>
                
                {/* Decorative gradient for featured */}
                {amenity.featured && (
                  <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <AnimatedSection delay={0.4} className="mt-12 lg:mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/10">
            {[
              { value: "15+", label: "Premium Amenities" },
              { value: "24/7", label: "Hot Water & Security" },
              { value: "3", label: "Meals Per Day" },
              { value: "100%", label: "WiFi Coverage" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <div className="font-heading font-bold text-2xl lg:text-3xl text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-text-muted text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
