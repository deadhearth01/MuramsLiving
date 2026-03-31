"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Layers,
  Wind,
  Wifi,
  Soup,
  Droplets,
  ShieldCheck,
  Sparkles,
  ParkingCircle,
  Sunset,
  MoveUp,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

const highlights = [
  {
    icon: <Building2 size={20} />,
    text: "New building, fully furnished",
  },
  {
    icon: <Layers size={20} />,
    text: "Marble flooring throughout",
  },
  {
    icon: <Wind size={20} />,
    text: "A/C & Non-A/C rooms available",
  },
  {
    icon: <Wifi size={20} />,
    text: "High Speed WiFi internet",
  },
  {
    icon: <Soup size={20} />,
    text: "Hot & home-made food daily",
  },
  {
    icon: <Droplets size={20} />,
    text: "24-hour hot water supply",
  },
  {
    icon: <ShieldCheck size={20} />,
    text: "24-hour security & CCTV",
  },
  {
    icon: <Sparkles size={20} />,
    text: "Daily housekeeping & cleaning",
  },
  {
    icon: <ParkingCircle size={20} />,
    text: "Covered bike parking",
  },
  {
    icon: <Sunset size={20} />,
    text: "Terrace beach view",
  },
  {
    icon: <MoveUp size={20} />,
    text: "Elevator / Lift facility",
  },
];

export default function Highlights() {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Main image placeholder */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #1A2E5A 0%, #2A4A8A 50%, #E8601C 100%)",
                height: "420px",
              }}
            >
              {/* Decorative content inside */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="font-heading text-6xl font-bold opacity-20 mb-4">
                    ML
                  </div>
                  <p className="text-white/60 text-sm max-w-xs">
                    Premium PG & Hostel Accommodation
                  </p>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-white/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white/10" />
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[#E8601C]/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-[#E8601C]" />
              </div>
              <div>
                <div className="font-bold text-[#1A2E5A] text-sm">24/7 Security</div>
                <div className="text-gray-500 text-xs">CCTV + Guards</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20, x: -20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -top-6 -left-6 bg-[#E8601C] text-white rounded-xl shadow-xl p-4"
            >
              <div className="font-heading font-bold text-2xl">11+</div>
              <div className="text-white/90 text-xs">Premium Features</div>
            </motion.div>
          </motion.div>

          {/* Right: List */}
          <div>
            <SectionTitle
              eyebrow="Why Choose Us"
              title="PG/Hostel "
              highlight="Highlights"
              description="Murams Living is built to provide the most comfortable and secure stay for students and working professionals in Visakhapatnam."
            />

            <div className="space-y-1">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="highlight-item group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#E8601C]/10 group-hover:bg-[#E8601C] flex items-center justify-center shrink-0 transition-all duration-300">
                    <span className="text-[#E8601C] group-hover:text-white transition-colors">
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
