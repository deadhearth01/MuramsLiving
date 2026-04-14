"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  Shield,
  CreditCard,
  Home,
  Wifi,
  Utensils,
  AlertTriangle,
  ScrollText,
  X,
  CheckCircle2,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const rulesData = [
  "All visitors must register at reception and provide required documents before entering the hostel.",
  "All residents access the building via biometric thumb reader system.",
  "Smoking and drinking are strictly prohibited on our property.",
  "Food (Breakfast, Lunch and Dinner) will be served as per menu timings.",
  "Be conscious about the usage of all facilities — Electricity, Water, and Food.",
  "All fees and charges must be paid timely as per the Resident Agreement.",
  "One-time 1-month deposit required in advance along with first month fee before joining.",
  "Hostel fee must be paid between 1st to 5th of every month.",
  "Inform management 1 month in advance before vacating the property.",
  "Advance deposit paid at joining is considered as fee for the last vacating month.",
  "WiFi bandwidth is limited per user and may change as per company policy.",
  "Each user can access the internet on a limited number of devices at a time.",
  "No anti-social activities are allowed. Violations will be reported to authorities.",
  "Cooking is strictly prohibited in any area except the designated kitchen.",
  "All food ordered from outside — leftovers and packaging must be disposed in dustbins.",
  "Maintain cleanliness in rooms at all times and avoid disturbances to others.",
  "Keep valuables locked in the provided storage locker. Do not leave them unsecured.",
  "Residents are responsible for any property damage they cause and will be charged for repairs.",
  "No animals or pets are allowed on the property.",
];

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "What are the check-in requirements?",
    answer:
      "All visitors must register at our reception and provide required documents (ID proof, photos, emergency contacts) as requested by the MuramsLiving Security team. Residents access the building using our biometric thumb reader system for enhanced security.",
    category: "General",
    icon: <Home size={18} />,
  },
  {
    question: "What is your alcohol and smoking policy?",
    answer:
      "Smoking and drinking are strictly prohibited on our property. We maintain a healthy and respectful environment for all residents. Violation of this policy may result in immediate termination of residency.",
    category: "Rules",
    icon: <AlertTriangle size={18} />,
  },
  {
    question: "How does the food service work?",
    answer:
      "We provide hot, home-cooked meals three times a day (Breakfast, Lunch, and Dinner) as per scheduled timings. Food ordered from outside is allowed, but all packaging materials and leftovers must be disposed of properly.",
    category: "Food",
    icon: <Utensils size={18} />,
  },
  {
    question: "What is the payment process and deposit policy?",
    answer:
      "We require a one-time security deposit equal to one month's rent, paid along with the first month's fee before joining. Monthly rent is due between the 1st and 5th of each month. The deposit is adjusted against your final month's rent upon vacating.",
    category: "Payment",
    icon: <CreditCard size={18} />,
  },
  {
    question: "What is the notice period for vacating?",
    answer:
      "Residents must inform management at least one month in advance before vacating. The advance deposit paid during joining will be considered as payment for the last month, so no additional payment is required for your final month.",
    category: "Payment",
    icon: <CreditCard size={18} />,
  },
  {
    question: "How does the WiFi/Internet work?",
    answer:
      "We provide Free Wifi throughout the property. Bandwidth speed depends on the service provider and is limited per user as per company policy. Each resident can connect a limited number of devices at a time.",
    category: "Amenities",
    icon: <Wifi size={18} />,
  },
  {
    question: "What security measures are in place?",
    answer:
      "We have 24/7 CCTV surveillance, security guards, and biometric entry systems. Residents are advised to keep valuables in the provided lockers. We maintain strict no anti-social activities policy and will report violations to authorities if necessary.",
    category: "Security",
    icon: <Shield size={18} />,
  },
  {
    question: "What are the cleanliness and kitchen rules?",
    answer:
      "Daily housekeeping is provided for common areas. Residents must maintain cleanliness in their rooms. Cooking is only allowed in designated kitchen areas. Please be considerate of other residents and avoid creating disturbances.",
    category: "Rules",
    icon: <Home size={18} />,
  },
];

export default function Rules() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [rulesOpen, setRulesOpen] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-navy/3 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left Column - Header */}
          <div className="lg:col-span-2">
            <AnimatedSection className="sticky top-32">
              <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
                FAQ
              </p>

              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy mb-6">
                Questions we hear all the time.
              </h2>

              <p className="text-text-secondary text-lg mb-8">
                Everything you need to know before joining Murams Living.
                Can&apos;t find your answer? Just call us.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-surface-secondary rounded-2xl p-5">
                  <div className="text-3xl font-bold text-navy mb-1">24/7</div>
                  <div className="text-sm text-text-muted">
                    Security & Support
                  </div>
                </div>
                <div className="bg-surface-secondary rounded-2xl p-5">
                  <div className="text-3xl font-bold text-primary mb-1">
                    1 Month
                  </div>
                  <div className="text-sm text-text-muted">Notice Period</div>
                </div>
              </div>

              {/* Rules Button */}
              <button
                onClick={() => setRulesOpen(true)}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-navy/20 hover:border-primary/40 hover:bg-primary/3 transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                  <ScrollText
                    size={18}
                    className="text-navy group-hover:text-primary transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-navy text-sm group-hover:text-primary transition-colors">
                    Murams Living — House Rules
                  </p>
                  <p className="text-text-muted text-xs mt-0.5">
                    Click to view all 19 residency rules
                  </p>
                </div>
                <Plus
                  size={16}
                  className="text-text-muted group-hover:text-primary transition-colors flex-shrink-0"
                />
              </button>
            </AnimatedSection>
          </div>

          {/* Rules Modal */}
          <AnimatePresence>
            {rulesOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setRulesOpen(false);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ScrollText size={18} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-navy text-lg leading-tight">
                          Murams Living
                        </h3>
                        <p className="text-text-muted text-xs">
                          House Rules & Guidelines
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setRulesOpen(false)}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Rules list */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {rulesData.map((rule, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-3.5 rounded-xl hover:bg-surface-secondary transition-colors group"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center mt-0.5">
                          <CheckCircle2 size={13} className="text-primary" />
                        </div>
                        <p className="text-navy text-sm leading-relaxed">
                          <span className="font-semibold text-primary mr-1">
                            {i + 1}.
                          </span>
                          {rule}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-5 border-t border-gray-100 bg-surface-secondary">
                    <p className="text-xs text-text-muted text-center">
                      By joining Murams Living, residents agree to abide by all
                      guidelines.
                    </p>
                    <button
                      onClick={() => setRulesOpen(false)}
                      className="mt-3 w-full py-3 bg-navy text-white font-semibold rounded-xl text-sm hover:bg-navy-dark transition-all"
                    >
                      I Understand
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Column - Accordion */}
          <div className="lg:col-span-3">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <AnimatedSection key={index} delay={index * 0.05}>
                  <div
                    className={`rounded-2xl border transition-all duration-300 ${
                      openIndex === index
                        ? "border-primary/20 bg-primary/[0.02] shadow-soft"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-start gap-4 p-5 lg:p-6 text-left"
                    >
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          openIndex === index
                            ? "bg-primary text-white"
                            : "bg-navy/5 text-navy"
                        }`}
                      >
                        {faq.icon}
                      </div>

                      {/* Question */}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-primary uppercase tracking-wider mb-1 block">
                          {faq.category}
                        </span>
                        <h3 className="font-heading font-semibold text-navy text-base lg:text-lg pr-4">
                          {faq.question}
                        </h3>
                      </div>

                      {/* Toggle Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          openIndex === index
                            ? "bg-primary text-white rotate-0"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {openIndex === index ? (
                          <Minus size={16} />
                        ) : (
                          <Plus size={16} />
                        )}
                      </div>
                    </button>

                    {/* Answer */}
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 lg:px-6 pb-5 lg:pb-6 pl-[76px] lg:pl-[88px]">
                            <p className="text-text-secondary leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Additional Note */}
            <AnimatedSection delay={0.4} className="mt-8">
              <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">
                    Important Note
                  </h4>
                  <p className="text-sm text-amber-700">
                    Complete house rules will be provided during check-in. By
                    joining Murams Living, residents agree to abide by all
                    guidelines to ensure a comfortable stay for everyone.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
