"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

const amenitiesLinks = [
  "Air-Conditioned Rooms",
  "High Speed WiFi",
  "Home-Cooked Meals",
  "24/7 Hot Water",
  "24/7 Security & CCTV",
  "Daily Housekeeping",
  "Elevator/Lift",
  "Beach View Terrace",
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A2E5A] text-white">
      <div className="container-custom py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo + About */}
          <div className="lg:col-span-1">
            <div className="flex flex-col leading-none mb-5">
              <span className="font-heading font-bold text-3xl text-[#E8601C]">
                Murams
              </span>
              <span className="font-heading font-semibold text-sm text-white/80 tracking-widest -mt-1">
                LIVING
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Your perfect home-like PG & Hostel stay in Rushikonda,
              Visakhapatnam. Experience comfort, safety, and community like never
              before.
            </p>
            <div className="flex items-center gap-2.5">
              {[
                {
                  href: "https://facebook.com",
                  icon: <FaFacebookF size={13} />,
                  label: "Facebook",
                },
                {
                  href: "https://instagram.com",
                  icon: <FaInstagram size={13} />,
                  label: "Instagram",
                },
                {
                  href: "https://twitter.com",
                  icon: <FaTwitter size={13} />,
                  label: "Twitter",
                },
                {
                  href: "https://linkedin.com",
                  icon: <FaLinkedinIn size={13} />,
                  label: "LinkedIn",
                },
                {
                  href: "https://wa.me/917816055655",
                  icon: <FaWhatsapp size={13} />,
                  label: "WhatsApp",
                },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E8601C] flex items-center justify-center transition-all duration-300"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-5 text-white relative">
              Quick Links
              <span className="block w-10 h-0.5 bg-[#E8601C] mt-2" />
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#E8601C] text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8601C] shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Amenities */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-5 text-white relative">
              Our Amenities
              <span className="block w-10 h-0.5 bg-[#E8601C] mt-2" />
            </h3>
            <ul className="space-y-2.5">
              {amenitiesLinks.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8601C] shrink-0" />
                  <span className="text-white/70 text-sm">{amenity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-5 text-white relative">
              Contact Us
              <span className="block w-10 h-0.5 bg-[#E8601C] mt-2" />
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+917816055655"
                  className="flex items-start gap-3 text-white/70 hover:text-[#E8601C] text-sm transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-[#E8601C]/20 flex items-center justify-center shrink-0 transition-colors">
                    <Phone size={14} />
                  </div>
                  <div>
                    <div>+91 7816055655</div>
                    <div className="mt-0.5">+91 7842222284</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@muramsliving.com"
                  className="flex items-start gap-3 text-white/70 hover:text-[#E8601C] text-sm transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-[#E8601C]/20 flex items-center justify-center shrink-0 transition-colors">
                    <Mail size={14} />
                  </div>
                  info@muramsliving.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/70 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin size={14} />
                  </div>
                  <div>
                    Murams Living, Rushikonda,
                    <br />
                    Visakhapatnam, Andhra Pradesh,
                    <br />
                    India - 530045
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/50">
          <p>&copy; {currentYear} Murams Living. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#E8601C] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="hover:text-[#E8601C] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
