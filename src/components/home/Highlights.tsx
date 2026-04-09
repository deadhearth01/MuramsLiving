"use client";

import { useRef, useEffect } from "react";
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
  MoveUp,
  Clock,
  Users,
  MapPin,
} from "lucide-react";

const features = [
  { icon: <Building2 size={20} />, text: "New Building" },
  { icon: <Layers size={20} />, text: "Marble Flooring" },
  { icon: <Wind size={20} />, text: "AC & Non-AC Rooms" },
  { icon: <Wifi size={20} />, text: "High-Speed WiFi" },
  { icon: <Soup size={20} />, text: "Home-Cooked Meals" },
  { icon: <Droplets size={20} />, text: "24/7 Hot Water" },
  { icon: <ShieldCheck size={20} />, text: "24/7 Security" },
  { icon: <ShieldCheck size={20} />, text: "Daily Housekeeping" },
  { icon: <ParkingCircle size={20} />, text: "Bike Parking" },
  { icon: <Sunset size={20} />, text: "Beach View Terrace" },
  { icon: <MoveUp size={20} />, text: "Elevator Access" },
  { icon: <Clock size={20} />, text: "Flexible Timings" },
  { icon: <Users size={20} />, text: "Community Events" },
  { icon: <MapPin size={20} />, text: "Prime Location" },
];

// Duplicate for seamless loop
const allFeatures = [...features, ...features];

export default function Highlights() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 lg:py-20 bg-navy-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
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
          <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em]">
            Why Residents Love Us
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-navy-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-navy-dark to-transparent z-10 pointer-events-none" />
          
          {/* Marquee Track */}
          <div 
            ref={marqueeRef}
            className="flex gap-4 overflow-hidden"
          >
            <motion.div
              className="flex gap-4 shrink-0"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 30,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {allFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-6 py-3.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shrink-0"
                >
                  <span className="text-primary">{feature.icon}</span>
                  <span className="text-white font-medium text-sm whitespace-nowrap">
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Reverse Marquee (optional second row) */}
        <div className="relative mt-4">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-navy-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-navy-dark to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-4 overflow-hidden">
            <motion.div
              className="flex gap-4 shrink-0"
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                duration: 35,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[...features].reverse().concat([...features].reverse()).map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-6 py-3.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shrink-0"
                >
                  <span className="text-primary">{feature.icon}</span>
                  <span className="text-white font-medium text-sm whitespace-nowrap">
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10 text-white/40 text-sm"
        >
          Experience premium living at affordable prices
        </motion.p>
      </div>
    </section>
  );
}
