"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { createClient } from "@/utils/supabase/client";

const contactDetails = [
  {
    icon: Phone,
    title: "Phone",
    lines: ["+91 7816055655", "+91 7842222284"],
    action: "tel:+917816055655",
  },
  {
    icon: FaWhatsapp,
    title: "WhatsApp",
    lines: ["Chat with us instantly", "+91 7816055655"],
    action:
      "https://wa.me/917816055655?text=Hi%2C%20I%27m%20interested%20in%20staying%20at%20Murams%20Living.",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@muramsliving.com", "Reply within 24 hours"],
    action: "mailto:info@muramsliving.com",
  },
  {
    icon: MapPin,
    title: "Location",
    lines: ["Rushikonda, Visakhapatnam", "Andhra Pradesh — 530045"],
    action: "https://maps.google.com/?q=Rushikonda+Visakhapatnam",
  },
  {
    icon: Clock,
    title: "Office Hours",
    lines: ["Mon–Sat: 9:00 AM – 8:00 PM", "Sun: 10:00 AM – 6:00 PM"],
    action: null,
  },
];

const faqs = [
  {
    q: "What room types are available?",
    a: "We offer 2-sharing, 3-sharing, and 4-sharing rooms, available in A/C and Non-A/C variants across our Gold and Silver buildings.",
  },
  {
    q: "Are meals included in the rent?",
    a: "Yes! We provide home-cooked breakfast, lunch, and dinner as part of the package. Our kitchen maintains high hygiene standards.",
  },
  {
    q: "Is there parking available?",
    a: "Yes, we have covered bike parking available for all residents free of charge.",
  },
  {
    q: "What is the advance/deposit amount?",
    a: "We require a 1-month deposit along with the first month's fee before joining. The advance is adjusted against the last month's rent.",
  },
  {
    q: "Is WiFi included?",
    a: "Yes, Free Wifi is included for all residents throughout the building.",
  },
  {
    q: "What is the notice period for vacating?",
    a: "We require 1 month's prior notice before vacating the room.",
  },
];

type FormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export default function ContactPageClient() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("site_enquiries").insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        message: formData.message || null,
        status: "new",
      });
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch {
      setError(
        "Failed to send. Please try calling us directly at +91 7816055655.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <section className="py-20 md:py-28 bg-navy-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container-custom relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              Get In Touch
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-5 leading-tight">
              Contact Us
            </h1>
            <p className="text-white/65 text-lg mb-8">
              Ready to make Murams Living your home? Reach out and we&apos;ll
              help you get started.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+917816055655"
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <Phone size={15} />
                Call Now
              </a>
              <a
                href="https://wa.me/917816055655?text=Hi%2C%20I%27m%20interested%20in%20booking%20a%20room."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <FaWhatsapp size={15} />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Details + Form */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
                  Reach Us
                </p>
                <h2 className="font-heading text-3xl font-bold text-navy mb-8">
                  Get in Touch
                </h2>
              </AnimatedSection>

              <div className="space-y-3">
                {contactDetails.map((detail, idx) => (
                  <AnimatedSection key={detail.title} delay={idx * 0.06}>
                    {detail.action ? (
                      <a
                        href={detail.action}
                        target={
                          detail.action.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          detail.action.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="flex items-start gap-4 p-4 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-transparent hover:border-primary/10 transition-all duration-200"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <detail.icon size={17} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-navy text-sm mb-0.5">
                            {detail.title}
                          </p>
                          {detail.lines.map((line, i) => (
                            <p key={i} className="text-text-secondary text-sm">
                              {line}
                            </p>
                          ))}
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-secondary border border-transparent">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <detail.icon size={17} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-navy text-sm mb-0.5">
                            {detail.title}
                          </p>
                          {detail.lines.map((line, i) => (
                            <p key={i} className="text-text-secondary text-sm">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </AnimatedSection>
                ))}
              </div>

              {/* Social Links */}
              <AnimatedSection delay={0.3} className="mt-8">
                <p className="font-semibold text-navy mb-3 text-sm">
                  Follow Us
                </p>
                <div className="flex gap-2">
                  {[
                    {
                      icon: FaFacebookF,
                      href: "https://facebook.com",
                      label: "Facebook",
                      bg: "bg-blue-600",
                    },
                    {
                      icon: FaInstagram,
                      href: "https://instagram.com",
                      label: "Instagram",
                      bg: "bg-pink-600",
                    },
                    {
                      icon: FaWhatsapp,
                      href: "https://wa.me/917816055655",
                      label: "WhatsApp",
                      bg: "bg-green-500",
                    },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-9 h-9 ${social.bg} text-white rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity`}
                    >
                      <social.icon size={15} />
                    </a>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <AnimatedSection delay={0.1}>
                <div className="bg-surface-secondary rounded-2xl p-6 md:p-8 border border-gray-100">
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10"
                      >
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={28} className="text-green-500" />
                        </div>
                        <h3 className="font-heading font-bold text-xl text-navy mb-2">
                          Message Sent!
                        </h3>
                        <p className="text-text-secondary text-sm mb-6">
                          Thank you for reaching out. We&apos;ll get back to you
                          within 24 hours.
                        </p>
                        <button
                          onClick={() => {
                            setSubmitted(false);
                            setFormData({
                              name: "",
                              phone: "",
                              email: "",
                              message: "",
                            });
                          }}
                          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition-colors"
                        >
                          Send Another Message
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <h2 className="font-heading font-bold text-xl text-navy mb-6">
                          Send Us an Enquiry
                        </h2>

                        {error && (
                          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                            {error}
                          </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-navy mb-1.5">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-navy mb-1.5">
                                Phone Number *
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 XXXXX XXXXX"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-navy mb-1.5">
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your@email.com (optional)"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-navy mb-1.5">
                              Message
                            </label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows={4}
                              placeholder="Tell us about your requirements, questions, or when you plan to join..."
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all disabled:opacity-60"
                          >
                            {submitting ? (
                              <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send size={16} />
                                Send Enquiry
                              </>
                            )}
                          </button>

                          <p className="text-center text-xs text-text-muted">
                            Or call directly:{" "}
                            <a
                              href="tel:+917816055655"
                              className="text-primary font-semibold"
                            >
                              +91 7816055655
                            </a>
                          </p>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12 bg-surface-secondary">
        <div className="container-custom">
          <h2 className="font-heading font-bold text-2xl text-navy mb-6 text-center">
            Find Us in Rushikonda
          </h2>
          <div className="w-full rounded-2xl overflow-hidden h-72 bg-navy flex items-center justify-center">
            <div className="text-center">
              <MapPin size={40} className="mx-auto mb-3 text-primary" />
              <h3 className="font-heading font-bold text-white mb-1">
                Murams Living
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Rushikonda, Visakhapatnam, Andhra Pradesh
              </p>
              <a
                href="https://maps.google.com/?q=Rushikonda+Visakhapatnam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-custom max-w-3xl">
          <AnimatedSection className="text-center mb-10">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              FAQ
            </p>
            <h2 className="font-heading font-bold text-3xl text-navy">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-secondary transition-colors"
                  >
                    <span className="font-medium text-navy text-sm pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-primary shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-text-secondary text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
