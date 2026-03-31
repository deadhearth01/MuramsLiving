"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

const attractions = [
  {
    name: "Rushikonda Beach",
    distance: "1 km",
    type: "Beach",
    description: "Beautiful golden sandy beach perfect for morning walks",
    color: "from-blue-400 to-cyan-500",
    emoji: "🏖️",
  },
  {
    name: "Geetham Medical College",
    distance: "Walkable",
    type: "Education",
    description: "Prestigious medical college within walking distance",
    color: "from-green-400 to-emerald-500",
    emoji: "🏥",
  },
  {
    name: "TTD Venkateswara Swamy Temple",
    distance: "2 km",
    type: "Temple",
    description: "Renowned Sri Venkateswara Swamy Devalayam",
    color: "from-yellow-400 to-orange-500",
    emoji: "🛕",
  },
  {
    name: "Food Centers",
    distance: "9 mins",
    type: "Dining",
    description: "Various restaurants and food courts nearby",
    color: "from-red-400 to-pink-500",
    emoji: "🍽️",
  },
  {
    name: "International Cricket Stadium",
    distance: "4 km",
    type: "Sports",
    description: "World-class cricket stadium for sports enthusiasts",
    color: "from-indigo-400 to-purple-500",
    emoji: "🏏",
  },
  {
    name: "IT SEZ / Tech Park",
    distance: "4 km",
    type: "Business",
    description: "Major IT hub with top technology companies",
    color: "from-[#1A2E5A] to-[#2A4A8A]",
    emoji: "💼",
  },
  {
    name: "Indira Gandhi Zoological Park",
    distance: "5 km",
    type: "Recreation",
    description: "One of India's largest zoos, great for weekends",
    color: "from-lime-400 to-green-500",
    emoji: "🦁",
  },
  {
    name: "RTC Bus Station",
    distance: "10 km",
    type: "Transport",
    description: "Central bus station with connections citywide",
    color: "from-amber-400 to-yellow-500",
    emoji: "🚌",
  },
  {
    name: "Visakhapatnam Railway Station",
    distance: "15 km",
    type: "Transport",
    description: "Major railway junction connecting all major cities",
    color: "from-gray-400 to-gray-600",
    emoji: "🚂",
  },
  {
    name: "Visakhapatnam Airport",
    distance: "22 km",
    type: "Transport",
    description: "International airport with domestic & intl flights",
    color: "from-sky-400 to-blue-500",
    emoji: "✈️",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function NearbyAttractions() {
  return (
    <section className="section-padding bg-[#FFF8F5]">
      <div className="container-custom">
        <SectionTitle
          eyebrow="Location Advantage"
          title="Nearby "
          highlight="Attractions"
          description="Murams Living is strategically located in Rushikonda with easy access to beaches, educational institutions, tech parks, and essential services."
          centered
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
        >
          {attractions.map((attraction) => (
            <motion.div
              key={attraction.name}
              variants={cardVariants}
              className="attraction-card group"
            >
              {/* Color header */}
              <div
                className={`h-28 bg-gradient-to-br ${attraction.color} flex items-center justify-center relative overflow-hidden`}
              >
                <span className="text-5xl">{attraction.emoji}</span>
                {/* Distance badge */}
                <div className="absolute top-3 right-3 bg-white/90 text-[#E8601C] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Navigation size={10} />
                  {attraction.distance}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-1.5">
                  <MapPin size={14} className="text-[#E8601C] shrink-0 mt-0.5" />
                  <h3 className="font-heading font-semibold text-sm text-[#1A2E5A] leading-tight">
                    {attraction.name}
                  </h3>
                </div>
                <span className="inline-block text-xs text-[#E8601C] bg-[#E8601C]/10 px-2 py-0.5 rounded-full mb-2">
                  {attraction.type}
                </span>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {attraction.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Map CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <a
            href="https://maps.google.com/?q=Rushikonda+Visakhapatnam"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            <MapPin size={16} />
            View on Google Maps
          </a>
        </motion.div>
      </div>
    </section>
  );
}
