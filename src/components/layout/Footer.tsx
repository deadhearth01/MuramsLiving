"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/students", label: "Students" },
  { href: "/tourists", label: "Tourists" },
  { href: "/silver", label: "Silver Building" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

const amenitiesLinks = [
  "AC Rooms",
  "Free Wifi",
  "Home-Cooked Meals",
  "24/7 Hot Water",
  "24/7 Security",
  "Housekeeping",
  "Elevator/Lift",
  "Beach View",
];

const socialLinks = [
  {
    href: "https://facebook.com",
    icon: FaFacebookF,
    label: "Facebook",
    color: "#1877F2",
  },
  {
    href: "https://instagram.com",
    icon: FaInstagram,
    label: "Instagram",
    color: "#E4405F",
  },
  {
    href: "https://wa.me/917816055655",
    icon: FaWhatsapp,
    label: "WhatsApp",
    color: "#25D366",
  },
  {
    href: "https://youtube.com",
    icon: FaYoutube,
    label: "YouTube",
    color: "#FF0000",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-navy-dark text-white overflow-hidden">
      {/* Shimmer keyframe animation for Silver Building link */}
      <style dangerouslySetInnerHTML={{ __html: String.raw`
        @keyframes silverShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .silver-shimmer-text {
          background: linear-gradient(
            90deg,
            #94a3b8 0%,
            #94a3b8 35%,
            #ffffff 50%,
            #94a3b8 65%,
            #94a3b8 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: silverShimmer 3s linear infinite;
        }
      ` }} />
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-navy-light/10 rounded-full blur-[80px]" />
      </div>

      {/* CTA Section */}
      <div className="relative border-b border-white/10">
        <div className="container-custom py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-heading text-3xl lg:text-4xl font-bold text-white mb-3"
              >
                Ready to make <span className="text-primary">Murams</span> your
                home?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-white/60 text-lg"
              >
                Book a visit today and experience premium living.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="tel:+917816055655"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300"
              >
                <Phone size={18} />
                <span>Call Us Now</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
              <a
                href="https://wa.me/917816055655"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.png"
                alt="Murams Living"
                width={180}
                height={45}
                className="brightness-0 invert"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
              Experience premium PG & Hostel living in Rushikonda,
              Visakhapatnam. Where comfort meets community, and every day feels
              like home.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 group"
                  style={
                    { "--hover-color": social.color } as React.CSSProperties
                  }
                >
                  <social.icon
                    size={16}
                    className="text-white/70 group-hover:text-white transition-colors"
                  />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const isSilver = link.href === "/silver";
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`group flex items-center gap-2 text-sm transition-all duration-300 ${
                        isSilver
                          ? "hover:text-white"
                          : "text-white/70 hover:text-primary"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full transition-all duration-300 ${
                          isSilver
                            ? "bg-slate-400 group-hover:bg-white group-hover:scale-150"
                            : "bg-primary/50 group-hover:bg-primary group-hover:scale-150"
                        }`}
                      />
                      {isSilver ? (
                        <span className="flex items-center gap-1.5 font-bold">
                          <span className="silver-shimmer-text">
                            {link.label}
                          </span>
                          <Sparkles size={12} className="text-slate-400 shrink-0" />
                        </span>
                      ) : (
                        <span>{link.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Amenities */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-6">
              Amenities
            </h3>
            <ul className="space-y-3">
              {amenitiesLinks.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/50" />
                  <span className="text-white/70 text-sm">{amenity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-6">
              Get in Touch
            </h3>
            <ul className="space-y-5">
              <li>
                <a
                  href="tel:+917816055655"
                  className="group flex items-start gap-4 text-white/70 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                    <Phone size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      Phone
                    </div>
                    <div className="text-sm">+91 7816055655</div>
                    <div className="text-sm">+91 7842222284</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@muramsliving.com"
                  className="group flex items-start gap-4 text-white/70 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                    <Mail size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      Email
                    </div>
                    <div className="text-sm">contact@muramsliving.com</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-4 text-white/70">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      Address
                    </div>
                    <div className="text-sm">
                      Murams Living, Rushikonda,
                      <br />
                      Visakhapatnam, AP - 530045
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            {/* Map Link */}
            <a
              href="https://maps.google.com/?q=Rushikonda,Visakhapatnam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-primary hover:text-primary-light transition-colors"
            >
              <span>View on Google Maps</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="relative border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>© {currentYear} Murams Living. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
