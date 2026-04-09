"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Utensils, Shield, Wifi, Wind, Check, ArrowRight, Phone,
  BedDouble, BedSingle, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { createClient } from "@/utils/supabase/client";

const defaultPrices: Record<string, string> = {
  "2-Sharing Room": "₹8,000",
  "3-Sharing Room": "₹6,500",
  "4-Sharing Room": "₹5,500",
};

const roomTypesDef = [
  {
    id: "double",
    Icon: BedDouble,
    title: "Double Sharing",
    beds: 2,
    priceKey: "2-Sharing Room",
    description: "Spacious rooms for two — ideal for those who value extra space and a quieter environment.",
    features: [
      "2 comfortable beds",
      "Personal wardrobe",
      "Study table & chair",
      "Attached / common bathroom",
      "Air conditioning",
      "High-speed WiFi",
    ],
    priceNote: "/month onwards",
    popular: false,
    accent: "border-gray-100",
    priceColor: "text-navy",
  },
  {
    id: "triple",
    Icon: Users,
    title: "Triple Sharing",
    beds: 3,
    priceKey: "3-Sharing Room",
    description: "Our most-requested option. The right balance of affordability, company, and personal space.",
    features: [
      "3 single beds",
      "Individual storage",
      "Study space",
      "Common bathroom",
      "AC available",
      "Free WiFi",
    ],
    priceNote: "/month onwards",
    popular: true,
    accent: "border-primary/30 ring-1 ring-primary/10",
    priceColor: "text-primary",
  },
  {
    id: "quad",
    Icon: BedSingle,
    title: "Four Sharing",
    beds: 4,
    priceKey: "4-Sharing Room",
    description: "Best value for budget-conscious residents. All essential amenities without compromise.",
    features: [
      "4 single beds",
      "Shared storage",
      "Fan / AC options",
      "Common bathroom",
      "Free WiFi",
      "All meals included",
    ],
    priceNote: "/month onwards",
    popular: false,
    accent: "border-gray-100",
    priceColor: "text-navy",
  },
];

const included = [
  { icon: Utensils, label: "3 Meals / Day",   sub: "Home-cooked"    },
  { icon: Shield,   label: "24/7 Security",   sub: "CCTV + Guards"  },
  { icon: Sparkles, label: "Housekeeping",    sub: "Daily cleaning" },
  { icon: Wifi,     label: "High-Speed WiFi", sub: "Unlimited"      },
  { icon: Wind,     label: "Hot Water",       sub: "24/7 available" },
];

export default function RoomTypes() {
  const [prices, setPrices] = useState<Record<string, string>>(defaultPrices);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("pricing_config")
          .select("item_name, amount")
          .eq("category", "student")
          .eq("is_visible", true)
          .order("display_order");
        if (data && data.length > 0) {
          const map: Record<string, string> = {};
          data.forEach((d) => {
            map[d.item_name] = `₹${Number(d.amount).toLocaleString("en-IN")}`;
          });
          setPrices((prev) => ({ ...prev, ...map }));
        }
      } catch { /* fallback to defaults */ }
    })();
  }, []);

  const roomTypes = roomTypesDef.map((r) => ({
    ...r,
    price: prices[r.priceKey] || defaultPrices[r.priceKey] || "₹0",
  }));

  return (
    <section className="py-24 lg:py-32 bg-surface-secondary relative overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <AnimatedSection className="max-w-2xl mb-14 lg:mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
            Accommodation Options
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy mb-5">
            Find the right room for you.
          </h2>
          <p className="text-text-secondary text-lg">
            Flexible room types for every budget. Every option includes our full suite
            of amenities — no hidden extras.
          </p>
        </AnimatedSection>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {roomTypes.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative bg-white rounded-2xl border-2 ${room.accent} p-7 flex flex-col shadow-soft hover:shadow-soft-md transition-all duration-300`}
            >
              {/* Popular badge */}
              {room.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${room.popular ? "bg-primary/10" : "bg-navy/5"}`}>
                  <room.Icon size={20} className={room.popular ? "text-primary" : "text-navy"} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-navy leading-tight">{room.title}</h3>
                  <p className="text-text-secondary text-xs mt-0.5">{room.beds}-bed room</p>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-6">{room.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-7 flex-1">
                {room.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-navy">
                    <Check size={13} className="text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Price + CTA */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <span className={`font-heading font-bold text-2xl ${room.priceColor}`}>{room.price}</span>
                    <span className="text-text-secondary text-xs ml-1">{room.priceNote}</span>
                  </div>
                </div>
                <a
                  href="tel:+917816055655"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    room.popular
                      ? "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-glow"
                      : "bg-navy/5 text-navy hover:bg-navy hover:text-white"
                  }`}
                >
                  <Phone size={14} />
                  Check Availability
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Included services */}
        <AnimatedSection delay={0.3}>
          <div className="bg-white rounded-2xl border border-gray-100 p-7 lg:p-9 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
              <div>
                <h3 className="font-heading font-bold text-lg text-navy">Included with every room</h3>
                <p className="text-text-muted text-sm mt-0.5">No surprise charges.</p>
              </div>
              <Link
                href="/book"
                className="group inline-flex items-center gap-2 text-primary text-sm font-semibold hover:underline shrink-0"
              >
                Book a room
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {included.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3 sm:flex-col sm:items-center sm:text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 sm:mb-2">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm leading-tight">{label}</p>
                    <p className="text-text-muted text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
