"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { Phone } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-[#E8601C] text-white py-2 px-4 text-sm hidden sm:block">
      <div className="container-custom flex items-center justify-between">
        {/* Phone numbers */}
        <div className="flex items-center gap-4">
          <a
            href="tel:+917816055655"
            className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
          >
            <Phone size={13} />
            <span>+91 7816055655</span>
          </a>
          <span className="text-white/50">|</span>
          <a
            href="tel:+917842222284"
            className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
          >
            <Phone size={13} />
            <span>+91 7842222284</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-xs mr-1">Follow Us:</span>
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Facebook"
          >
            <FaFacebookF size={11} />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram size={11} />
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Twitter"
          >
            <FaTwitter size={11} />
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={11} />
          </Link>
          <Link
            href="https://wa.me/917816055655"
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="WhatsApp"
          >
            <FaWhatsapp size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
