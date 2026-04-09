"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, Shield, CreditCard, Home, Wifi, Utensils, AlertTriangle } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "What are the check-in requirements?",
    answer: "All visitors must register at our reception and provide required documents (ID proof, photos, emergency contacts) as requested by the MuramsLiving Security team. Residents access the building using our biometric thumb reader system for enhanced security.",
    category: "General",
    icon: <Home size={18} />,
  },
  {
    question: "What is your alcohol and smoking policy?",
    answer: "Smoking and drinking are strictly prohibited on our property. We maintain a healthy and respectful environment for all residents. Violation of this policy may result in immediate termination of residency.",
    category: "Rules",
    icon: <AlertTriangle size={18} />,
  },
  {
    question: "How does the food service work?",
    answer: "We provide hot, home-cooked meals three times a day (Breakfast, Lunch, and Dinner) as per scheduled timings. Food ordered from outside is allowed, but all packaging materials and leftovers must be disposed of properly.",
    category: "Food",
    icon: <Utensils size={18} />,
  },
  {
    question: "What is the payment process and deposit policy?",
    answer: "We require a one-time security deposit equal to one month's rent, paid along with the first month's fee before joining. Monthly rent is due between the 1st and 5th of each month. The deposit is adjusted against your final month's rent upon vacating.",
    category: "Payment",
    icon: <CreditCard size={18} />,
  },
  {
    question: "What is the notice period for vacating?",
    answer: "Residents must inform management at least one month in advance before vacating. The advance deposit paid during joining will be considered as payment for the last month, so no additional payment is required for your final month.",
    category: "Payment",
    icon: <CreditCard size={18} />,
  },
  {
    question: "How does the WiFi/Internet work?",
    answer: "We provide high-speed WiFi throughout the property. Bandwidth speed depends on the service provider and is limited per user as per company policy. Each resident can connect a limited number of devices at a time.",
    category: "Amenities",
    icon: <Wifi size={18} />,
  },
  {
    question: "What security measures are in place?",
    answer: "We have 24/7 CCTV surveillance, security guards, and biometric entry systems. Residents are advised to keep valuables in the provided lockers. We maintain strict no anti-social activities policy and will report violations to authorities if necessary.",
    category: "Security",
    icon: <Shield size={18} />,
  },
  {
    question: "What are the cleanliness and kitchen rules?",
    answer: "Daily housekeeping is provided for common areas. Residents must maintain cleanliness in their rooms. Cooking is only allowed in designated kitchen areas. Please be considerate of other residents and avoid creating disturbances.",
    category: "Rules",
    icon: <Home size={18} />,
  },
];

export default function Rules() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-secondary rounded-2xl p-5">
                  <div className="text-3xl font-bold text-navy mb-1">24/7</div>
                  <div className="text-sm text-text-muted">Security & Support</div>
                </div>
                <div className="bg-surface-secondary rounded-2xl p-5">
                  <div className="text-3xl font-bold text-primary mb-1">1 Month</div>
                  <div className="text-sm text-text-muted">Notice Period</div>
                </div>
              </div>
            </AnimatedSection>
          </div>

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
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        openIndex === index 
                          ? "bg-primary text-white" 
                          : "bg-navy/5 text-navy"
                      }`}>
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        openIndex === index 
                          ? "bg-primary text-white rotate-0" 
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                      </div>
                    </button>
                    
                    {/* Answer */}
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
                  <h4 className="font-semibold text-amber-900 mb-1">Important Note</h4>
                  <p className="text-sm text-amber-700">
                    Complete house rules will be provided during check-in. 
                    By joining Murams Living, residents agree to abide by all guidelines 
                    to ensure a comfortable stay for everyone.
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
