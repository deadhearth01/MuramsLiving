"use client";

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
  ShirtIcon,
  Wifi,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Link from "next/link";

const amenities = [
  {
    icon: <Moon size={26} />,
    title: "Comfortable Beds",
    description: "Premium mattresses for a good night's sleep",
  },
  {
    icon: <Archive size={26} />,
    title: "Individual Cupboards",
    description: "Personal storage space for each resident",
  },
  {
    icon: <Wind size={26} />,
    title: "Air-Conditioned",
    description: "Climate-controlled rooms for your comfort",
  },
  {
    icon: <Tv size={26} />,
    title: "TV Entertainment",
    description: "Cable TV in common rooms for relaxation",
  },
  {
    icon: <Sun size={26} />,
    title: "Solar Water Heating",
    description: "Eco-friendly 24-hr hot water system",
  },
  {
    icon: <UtensilsCrossed size={26} />,
    title: "Dining Room",
    description: "Delicious home-style meals daily",
  },
  {
    icon: <WashingMachine size={26} />,
    title: "Washing Machine",
    description: "On-site laundry facilities available",
  },
  {
    icon: <Sunset size={26} />,
    title: "Beach View Terrace",
    description: "Stunning ocean views from rooftop",
  },
  {
    icon: <ShirtIcon size={26} />,
    title: "Dhobi / Laundry",
    description: "Professional laundry service available",
  },
  {
    icon: <Wifi size={26} />,
    title: "High Speed WiFi",
    description: "Blazing fast internet throughout",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AmenitiesSection() {
  return (
    <section className="section-padding bg-[#FFF8F5]">
      <div className="container-custom">
        <SectionTitle
          eyebrow="Amenities"
          title="Everything You "
          highlight="Need"
          description="We've thought of everything so you don't have to. Enjoy a comprehensive set of amenities designed to make your stay truly comfortable."
          centered
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5"
        >
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.title}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(232, 96, 28, 0.15)" }}
              className="bg-white rounded-2xl p-5 text-center flex flex-col items-center gap-3 border border-gray-100 cursor-default group transition-all duration-300"
            >
              <div className="icon-ring group-hover:!bg-gradient-to-br group-hover:from-[#E8601C] group-hover:to-[#F4845F] transition-all duration-300">
                <span className="text-[#E8601C] group-hover:text-white transition-colors">
                  {amenity.icon}
                </span>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-[#1A2E5A] mb-1">
                  {amenity.title}
                </h3>
                <p className="text-gray-500 text-xs leading-snug hidden sm:block">
                  {amenity.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link href="/amenities" className="btn-outline inline-flex">
            View All Amenities
          </Link>
        </div>
      </div>
    </section>
  );
}
