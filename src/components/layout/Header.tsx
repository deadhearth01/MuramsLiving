"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ArrowRight, MapPin, Mail } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Main Header */}
      <motion.header
        ref={headerRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-soft-lg"
            : "bg-white"
        }`}
      >
        <div className="container-custom">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              isScrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo */}
            <Link href="/" className="relative group flex items-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Image
                  src="/logo.png"
                  alt="Murams Living"
                  width={isScrolled ? 140 : 160}
                  height={isScrolled ? 35 : 40}
                  className="transition-all duration-500"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="relative px-4 py-2 text-sm font-medium transition-colors duration-300"
                    >
                      <span
                        className={`relative z-10 transition-colors duration-300 ${
                          pathname === link.href
                            ? "text-primary"
                            : hoveredLink === link.href
                            ? "text-primary"
                            : "text-navy"
                        }`}
                      >
                        {link.label}
                      </span>
                      
                      {/* Active/Hover indicator */}
                      <AnimatePresence>
                        {(pathname === link.href || hoveredLink === link.href) && (
                          <motion.span
                            layoutId="navIndicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-primary/5 rounded-lg"
                          />
                        )}
                      </AnimatePresence>
                      
                      {/* Underline for active */}
                      {pathname === link.href && (
                        <motion.span
                          layoutId="activeUnderline"
                          className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-primary-light rounded-full"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-4">
              {/* Desktop CTA */}
              <Link href="/book" passHref legacyBehavior>
                <motion.a
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden lg:flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-xl shadow-soft hover:shadow-glow transition-shadow duration-300"
                >
                  <span>Book Now</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </motion.a>
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(true)}
                className="lg:hidden relative w-11 h-11 flex items-center justify-center rounded-xl bg-surface-secondary hover:bg-primary/10 text-navy hover:text-primary transition-all duration-300"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Scroll progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-primary-light to-primary origin-left"
          style={{
            scaleX: isScrolled ? 1 : 0,
            opacity: isScrolled ? 0.3 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-navy-dark/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-[70] h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-5 border-b border-surface-tertiary">
              <Image
                src="/logo.png"
                alt="Murams Living"
                width={120}
                height={30}
                priority
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-secondary text-navy hover:bg-primary/10 hover:text-primary transition-all duration-300"
                aria-label="Close menu"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 py-6 px-5 overflow-y-auto">
              <ul className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between px-4 py-4 rounded-xl font-medium transition-all duration-300 ${
                        pathname === link.href
                          ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-soft"
                          : "text-navy hover:bg-surface-secondary hover:text-primary"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight size={16} className={pathname === link.href ? "text-white/70" : "text-primary/50"} />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Mobile Footer */}
            <div className="p-5 border-t border-surface-tertiary space-y-4 bg-surface-secondary/50">
              <a
                href="tel:+917816055655"
                className="flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-soft"
              >
                <Phone size={18} />
                <span>+91 7816055655</span>
              </a>
              
              <a
                href="https://wa.me/917816055655"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#25D366] text-white font-semibold rounded-xl"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp Us</span>
              </a>

              <div className="flex items-center justify-center gap-4 pt-2">
                {[
                  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
                  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center text-navy hover:text-primary hover:scale-110 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
