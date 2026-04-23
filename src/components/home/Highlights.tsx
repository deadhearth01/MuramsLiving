"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Layers,
  Wind,
  Wifi,
  Soup,
  Droplets,
  ShieldCheck,
  ParkingCircle,
  Sunset,
  ArrowUpDown,
  Clock4,
  Users,
  MapPin,
  WashingMachine,
  Tv2,
  UtensilsCrossed,
} from "lucide-react";

const row1 = [
  { icon: Building2, text: "New Building" },
  { icon: Layers, text: "Marble Flooring" },
  { icon: Wind, text: "AC & Non-AC Rooms" },
  { icon: Wifi, text: "Free Wifi" },
  { icon: Soup, text: "Home-Cooked Meals" },
  { icon: Droplets, text: "24/7 Hot Water" },
  { icon: ShieldCheck, text: "24/7 Security" },
  { icon: UtensilsCrossed, text: "Daily Housekeeping" },
];

const row2 = [
  { icon: ParkingCircle, text: "Bike Parking" },
  { icon: Sunset, text: "Beach View Terrace" },
  { icon: ArrowUpDown, text: "Elevator Access" },
  { icon: Clock4, text: "Flexible Timings" },
  { icon: Users, text: "Community Events" },
  { icon: MapPin, text: "Prime Location" },
  { icon: WashingMachine, text: "Laundry Service" },
  { icon: Tv2, text: "Common TV Lounge" },
];

// Triplicate to ensure seamless infinite scroll
const allRow1 = [...row1, ...row1, ...row1];
const allRow2 = [...row2, ...row2, ...row2];

function MarqueePill({
  icon: Icon,
  text,
  highlighted,
  onEnter,
  onLeave,
}: {
  icon: React.ElementType;
  text: string;
  highlighted: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`flex items-center gap-3 px-5 py-3 rounded-full border shrink-0 cursor-default transition-all duration-300 select-none ${
        highlighted
          ? "bg-primary border-primary/80 shadow-lg shadow-primary/30 scale-105"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          highlighted ? "bg-white/20" : "bg-primary/20"
        }`}
      >
        <Icon
          size={15}
          className={highlighted ? "text-white" : "text-primary"}
        />
      </div>
      <span
        className={`font-medium text-sm whitespace-nowrap transition-colors duration-300 ${
          highlighted ? "text-white" : "text-white/80"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

export default function Highlights() {
  const [pauseRow1, setPauseRow1] = useState(false);
  const [pauseRow2, setPauseRow2] = useState(false);
  const [hoveredRow1, setHoveredRow1] = useState<number | null>(null);
  const [hoveredRow2, setHoveredRow2] = useState<number | null>(null);

  return (
    <section className="py-16 lg:py-20 bg-navy-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-2">
            Why Residents Love Us
          </p>
          <p className="text-white/30 text-xs">Hover to explore</p>
        </motion.div>

        {/* Row 1 — left scrolling */}
        <div
          className="relative overflow-hidden mb-4"
          onMouseEnter={() => setPauseRow1(true)}
          onMouseLeave={() => {
            setPauseRow1(false);
            setHoveredRow1(null);
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-navy-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-navy-dark to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-3 w-max"
            animate={{ x: ["0%", "-33.333%"] }}
            transition={{
              duration: 60,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ animationPlayState: pauseRow1 ? "paused" : "running" }}
          >
            {allRow1.map((feature, index) => (
              <MarqueePill
                key={index}
                icon={feature.icon}
                text={feature.text}
                highlighted={hoveredRow1 === index % row1.length}
                onEnter={() => setHoveredRow1(index % row1.length)}
                onLeave={() => setHoveredRow1(null)}
              />
            ))}
          </motion.div>
        </div>

        {/* Row 2 — right scrolling */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setPauseRow2(true)}
          onMouseLeave={() => {
            setPauseRow2(false);
            setHoveredRow2(null);
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-navy-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-navy-dark to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-3 w-max"
            animate={{ x: ["-33.333%", "0%"] }}
            transition={{
              duration: 70,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {allRow2.map((feature, index) => (
              <MarqueePill
                key={index}
                icon={feature.icon}
                text={feature.text}
                highlighted={hoveredRow2 === index % row2.length}
                onEnter={() => setHoveredRow2(index % row2.length)}
                onLeave={() => setHoveredRow2(null)}
              />
            ))}
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10 text-white/30 text-sm"
        >
          Experience premium living at affordable prices
        </motion.p>
      </div>
    </section>
  );
}
