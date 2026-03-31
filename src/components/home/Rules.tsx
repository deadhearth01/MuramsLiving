"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldAlert } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

const rules = [
  "All visitors must register at our reception and provide all details and documents as requested by the MuramsLiving Security team before entering the Hostel.",
  "All residents of a House can enter/exit the House by accessing the bio-metric thumb reader system.",
  "Smoking/Drinking are strictly prohibited at our property and necessary actions are taken against the rule break.",
  "As per menu timings food (Breakfast, Lunch and Dinner) will be served.",
  "Be conscience about the usage of all facilities like Electricity, Water, and food.",
  "The resident shall pay all fees and charges timely and, in the manner, prescribed as per their Resident Agreement.",
  "We request one-time 1 month deposit in advance along with the first month hostel fee before joining our hostel.",
  "Hostel fee needs to be paid between 1st to 5th of every month.",
  "Must inform the MuramsLiving management 1 month ahead in case of vacating the property.",
  "Advance amount paid while joining will be considered as fee for the last vacating month i.e. You don't have to pay the last month fee.",
  "Bandwidth speed will depend on the service provider. Speed will be limited per user and may be changed as per company policy.",
  "Devices per user: Houses may have a restriction on the maximum number of devices per user. One user can access the internet on limited devices at a time.",
  "No Anti-Social activities are encouraged and are strictly prohibited and reported to law if necessary.",
  "Cooking in any area except the kitchen room is strictly prohibited.",
  "If food is ordered from outside by the residents, then all leftovers and packaging materials should be disposed in appropriate dustbins.",
  "Ensure cleanliness and hygiene is always maintained in the room by individuals. Please be considerate about others living in the building/area and avoid any disturbances.",
  "Residents are advised not to leave their valuables open and unsecured in their room. Please always keep valuable things in the locker provided.",
];

const INITIAL_SHOW = 8;

export default function Rules() {
  const [showAll, setShowAll] = useState(false);
  const visibleRules = showAll ? rules : rules.slice(0, INITIAL_SHOW);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-4xl">
        <SectionTitle
          eyebrow="House Guidelines"
          title="Murams Living "
          highlight="Rules"
          description="Below are the rules which need to be followed by all our residents staying in MuramsLiving. These guidelines ensure a safe, clean, and respectful environment for everyone."
          centered
        />

        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {/* Header bar */}
          <div className="bg-[#1A2E5A] px-5 py-3 flex items-center gap-2">
            <ShieldAlert size={18} className="text-[#E8601C]" />
            <span className="text-white font-semibold text-sm">
              Resident Rules & Regulations
            </span>
          </div>

          {/* Rules list */}
          <div>
            <AnimatePresence>
              {visibleRules.map((rule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="rules-item"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E8601C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{rule}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Show more / less */}
          {rules.length > INITIAL_SHOW && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full flex items-center justify-center gap-2 py-4 text-[#E8601C] font-semibold text-sm hover:bg-[#FFF8F5] transition-colors border-t border-gray-100"
            >
              {showAll ? "Show Less" : `Show All ${rules.length} Rules`}
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
