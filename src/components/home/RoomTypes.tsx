"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Utensils,
  Shield,
  Wifi,
  Wind,
  Check,
  ArrowRight,
  Sparkles,
  BedDouble,
  BedSingle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { createClient } from "@/utils/supabase/client";

const defaultPrices: Record<string, string> = {
  "2-Sharing Room": "₹10,000",
  "3-Sharing Room": "₹6,000",
  "4-Sharing Room": "₹8,000",
};

// What makes each plan unique — only the bed count differs
const plans = [
  {
    id: "double",
    Icon: BedDouble,
    title: "Double Sharing",
    priceKey: "2-Sharing Room",
    beds: 2,
    tagline: "Maximum space & privacy",
    highlight: "2 beds per room",
    popular: false,
    accent: "border-gray-200",
    badgeClass: "",
  },
  {
    id: "triple",
    Icon: Users,
    title: "Triple Sharing",
    priceKey: "3-Sharing Room",
    beds: 3,
    tagline: "Balance of company & space",
    highlight: "3 beds per room",
    popular: true,
    accent: "border-primary ring-1 ring-primary/20",
    badgeClass: "bg-primary text-white",
  },
  {
    id: "quad",
    Icon: BedSingle,
    title: "Four Sharing",
    priceKey: "4-Sharing Room",
    beds: 4,
    tagline: "Best value for budget residents",
    highlight: "4 beds per room",
    popular: false,
    accent: "border-gray-200",
    badgeClass: "",
  },
];

// Everything included in ALL plans — shown once
const sharedAmenities = [
  { icon: Utensils, label: "3 Meals / Day", sub: "Breakfast, lunch & dinner" },
  { icon: Shield, label: "24/7 Security", sub: "CCTV + guards" },
  { icon: Sparkles, label: "Housekeeping", sub: "Daily room cleaning" },
  { icon: Wifi, label: "Free Wifi", sub: "Unlimited internet" },
  { icon: Wind, label: "Hot Water 24/7", sub: "Solar-powered system" },
];

const roomExtras = [
  "Personal wardrobe / storage",
  "Study table & chair",
  "Attached or common bathroom",
  "AC (optional upgrade)",
  "Marble flooring",
  "Elevator access",
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
      } catch {
        /* fallback to defaults */
      }
    })();
  }, []);

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
            Same premium amenities in every room — the only difference is how
            many people you share with. Pick the configuration that suits your
            lifestyle and budget.
          </p>
        </AnimatedSection>

        {/* Layout: cards left, shared inclusions right */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          {/* ── Pricing Cards ─────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-4">
            {plans.map((plan, i) => {
              const price =
                prices[plan.priceKey] || defaultPrices[plan.priceKey];
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`relative bg-white rounded-2xl border-2 ${plan.accent} p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-all duration-300 group`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-6 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      Most Popular
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${plan.popular ? "bg-primary/10" : "bg-navy/5"} group-hover:scale-105 transition-transform`}
                  >
                    <plan.Icon
                      size={24}
                      className={plan.popular ? "text-primary" : "text-navy"}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-navy leading-tight">
                          {plan.title}
                        </h3>
                        <p className="text-text-secondary text-sm mt-0.5">
                          {plan.tagline}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div
                          className={`font-heading font-bold text-2xl ${plan.popular ? "text-primary" : "text-navy"}`}
                        >
                          {price}
                        </div>
                        <p className="text-text-muted text-xs">
                          /month onwards
                        </p>
                      </div>
                    </div>

                    {/* What's unique about this plan */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="flex items-center gap-1.5 bg-surface-secondary text-navy text-xs font-semibold px-3 py-1.5 rounded-full">
                        <plan.Icon size={12} />
                        {plan.highlight}
                      </span>
                      <span className="text-text-muted text-xs">
                        · Everything else stays the same
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/book"
                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-primary text-white hover:bg-primary-dark shadow-sm"
                        : "bg-navy/5 text-navy hover:bg-navy hover:text-white"
                    }`}
                  >
                    <span className="hidden sm:inline">Check Availability</span>
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ── What's Included (shared across all plans) ─────── */}
          <AnimatedSection delay={0.2} className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm sticky top-8">
              <h3 className="font-heading font-bold text-navy text-lg mb-1">
                Included with every room
              </h3>
              <p className="text-text-muted text-sm mb-6">
                No extra charges. No surprises. Same for all sharing types.
              </p>

              {/* Core amenities */}
              <div className="space-y-4 mb-6">
                {sharedAmenities.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm leading-tight">
                        {label}
                      </p>
                      <p className="text-text-muted text-xs">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Room extras */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                  Also in every room
                </p>
                <div className="space-y-2">
                  {roomExtras.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-navy"
                    >
                      <Check size={13} className="text-primary flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/book"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-dark transition-all group"
              >
                Book a Room
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
