"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import SectionTitle from "@/components/ui/SectionTitle";

const contactDetails = [
  {
    icon: <Phone size={22} />,
    title: "Phone Numbers",
    lines: ["+91 7816055655", "+91 7842222284"],
    action: "tel:+917816055655",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: <FaWhatsapp size={22} />,
    title: "WhatsApp",
    lines: ["Chat with us on WhatsApp", "+91 7816055655"],
    action: "https://wa.me/917816055655?text=Hi%2C%20I%27m%20interested%20in%20staying%20at%20Murams%20Living.",
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: <Mail size={22} />,
    title: "Email",
    lines: ["info@muramsliving.com", "We reply within 24 hours"],
    action: "mailto:info@muramsliving.com",
    color: "bg-orange-50",
    iconColor: "text-[#E8601C]",
  },
  {
    icon: <MapPin size={22} />,
    title: "Location",
    lines: ["Rushikonda, Visakhapatnam", "Andhra Pradesh — 530045"],
    action: "https://maps.google.com/?q=Rushikonda+Visakhapatnam",
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: <Clock size={22} />,
    title: "Office Hours",
    lines: ["Mon–Sat: 9:00 AM – 8:00 PM", "Sun: 10:00 AM – 6:00 PM"],
    action: null,
    color: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

const faqs = [
  {
    q: "What room types are available?",
    a: "We offer Double Occupancy (2 beds), Triple Occupancy (3 beds), and Quadruple Occupancy (4 beds) rooms, available in A/C and Non-A/C variants.",
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
    a: "Yes, high-speed WiFi is included for all residents throughout the building.",
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
  roomType: string;
  message: string;
};

export default function ContactPageClient() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    roomType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 50%, #2A1A0E 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#E8601C]" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#F4845F]" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-[#E8601C]/20 border border-[#E8601C]/30 text-[#F4845F] text-xs font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4"
          >
            Contact{" "}
            <span className="gradient-text">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Ready to make Murams Living your home? Reach out to us and we'll
            help you get started.
          </motion.p>

          {/* Quick contact buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            <a
              href="tel:+917816055655"
              className="flex items-center gap-2 bg-white text-[#E8601C] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
            >
              <Phone size={15} />
              Call Now
            </a>
            <a
              href="https://wa.me/917816055655?text=Hi%2C%20I%27m%20interested%20in%20booking%20a%20room."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#1EBE5A] transition-colors"
            >
              <FaWhatsapp size={15} />
              WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Details + Form */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2">
              <SectionTitle
                eyebrow="Reach Us"
                title="Get in "
                highlight="Touch"
                description="We're here to answer all your questions and help you find the perfect room."
              />

              <div className="space-y-4">
                {contactDetails.map((detail) => (
                  <motion.div
                    key={detail.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    {detail.action ? (
                      <a
                        href={detail.action}
                        target={detail.action.startsWith("http") ? "_blank" : undefined}
                        rel={detail.action.startsWith("http") ? "noopener noreferrer" : undefined}
                        className={`flex items-start gap-4 p-4 rounded-xl ${detail.color} hover:shadow-md transition-all duration-300 group`}
                      >
                        <div className={`${detail.iconColor} mt-0.5 shrink-0`}>
                          {detail.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1A2E5A] text-sm mb-0.5">
                            {detail.title}
                          </h3>
                          {detail.lines.map((line, i) => (
                            <p key={i} className="text-gray-600 text-sm">
                              {line}
                            </p>
                          ))}
                        </div>
                      </a>
                    ) : (
                      <div
                        className={`flex items-start gap-4 p-4 rounded-xl ${detail.color}`}
                      >
                        <div className={`${detail.iconColor} mt-0.5 shrink-0`}>
                          {detail.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1A2E5A] text-sm mb-0.5">
                            {detail.title}
                          </h3>
                          {detail.lines.map((line, i) => (
                            <p key={i} className="text-gray-600 text-sm">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="font-heading font-semibold text-[#1A2E5A] mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {[
                    {
                      icon: <FaFacebookF size={16} />,
                      href: "https://facebook.com",
                      label: "Facebook",
                      bg: "bg-blue-600",
                    },
                    {
                      icon: <FaInstagram size={16} />,
                      href: "https://instagram.com",
                      label: "Instagram",
                      bg: "bg-pink-600",
                    },
                    {
                      icon: <FaTwitter size={16} />,
                      href: "https://twitter.com",
                      label: "Twitter",
                      bg: "bg-sky-500",
                    },
                    {
                      icon: <FaWhatsapp size={16} />,
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
                      className={`w-10 h-10 ${social.bg} text-white rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-[#FFF8F5] rounded-2xl p-6 md:p-8 border border-gray-100">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-[#1A2E5A] mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Thank you for contacting us. We'll get back to you within
                      24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          phone: "",
                          email: "",
                          roomType: "",
                          message: "",
                        });
                      }}
                      className="btn-primary"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="font-heading font-bold text-xl text-[#1A2E5A] mb-6">
                      Send Us an Enquiry
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A2E5A] mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A2E5A] text-sm focus:outline-none focus:border-[#E8601C] focus:ring-2 focus:ring-[#E8601C]/10 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A2E5A] mb-1.5">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A2E5A] text-sm focus:outline-none focus:border-[#E8601C] focus:ring-2 focus:ring-[#E8601C]/10 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A2E5A] mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A2E5A] text-sm focus:outline-none focus:border-[#E8601C] focus:ring-2 focus:ring-[#E8601C]/10 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A2E5A] mb-1.5">
                          Room Type Interested In
                        </label>
                        <select
                          name="roomType"
                          value={formData.roomType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A2E5A] text-sm focus:outline-none focus:border-[#E8601C] focus:ring-2 focus:ring-[#E8601C]/10 transition-all"
                        >
                          <option value="">Select a room type</option>
                          <option value="double">Double Occupancy (2 Beds)</option>
                          <option value="triple">Triple Occupancy (3 Beds)</option>
                          <option value="quad">Quadruple Occupancy (4 Beds)</option>
                          <option value="ac">A/C Room</option>
                          <option value="non-ac">Non-A/C Room</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A2E5A] mb-1.5">
                          Message / Questions
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about your requirements, questions, or when you plan to join..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A2E5A] text-sm focus:outline-none focus:border-[#E8601C] focus:ring-2 focus:ring-[#E8601C]/10 transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full btn-primary justify-center py-3.5 text-base"
                      >
                        <Send size={17} />
                        Send Enquiry
                      </button>

                      <p className="text-center text-xs text-gray-500">
                        Or call us directly at{" "}
                        <a
                          href="tel:+917816055655"
                          className="text-[#E8601C] font-semibold"
                        >
                          +91 7816055655
                        </a>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-[#FFF8F5]">
        <div className="container-custom">
          <h2 className="font-heading font-bold text-2xl text-[#1A2E5A] mb-6 text-center">
            Find Us in Rushikonda
          </h2>
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{ height: "400px" }}
          >
            {/* Map placeholder */}
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1A2E5A 0%, #2A4A8A 100%)",
              }}
            >
              <div className="text-center text-white">
                <MapPin size={48} className="mx-auto mb-4 text-[#E8601C]" />
                <h3 className="font-heading font-bold text-xl mb-2">
                  Murams Living
                </h3>
                <p className="text-white/70 mb-4">
                  Rushikonda, Visakhapatnam, Andhra Pradesh
                </p>
                <a
                  href="https://maps.google.com/?q=Rushikonda+Visakhapatnam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex text-sm"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <SectionTitle
            eyebrow="FAQ"
            title="Frequently Asked "
            highlight="Questions"
            description="Got questions? We've answered the most common ones below."
            centered
          />

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-[#FFF8F5] transition-colors"
                >
                  <span className="font-medium text-[#1A2E5A] text-sm md:text-base pr-4">
                    {faq.q}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full bg-[#E8601C]/10 text-[#E8601C] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 md:px-5 pb-4 md:pb-5"
                  >
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
