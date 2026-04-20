"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ArrowRight, MapPin, Mail, ChevronDown, Sparkles } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

interface NavChild {
  href: string;
  label: string;
}

interface NavLink {
  href: string;
  label: string;
  children?: NavChild[];
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/silver", label: "Silver Building" },
  { href: "#", label: "Stay With Us", children: [
    { href: "/students", label: "For Students" },
    { href: "/tourists", label: "For Guests" },
  ]},
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [stayDropdownOpen, setStayDropdownOpen] = useState(false);
  const [mobileStayOpen, setMobileStayOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
                {navLinks.map((link) => {
                  const isSilver = link.href === "/silver";
                  const hasChildren = !!link.children;
                  const isActive = hasChildren
                    ? link.children!.some((c) => pathname === c.href)
                    : pathname === link.href;
                  const isHovered = hoveredLink === link.href;

                  // Dropdown parent (Stay With Us)
                  if (hasChildren) {
                    return (
                      <li
                        key={link.label}
                        className="relative"
                        onMouseEnter={() => {
                          if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                          setStayDropdownOpen(true);
                          setHoveredLink(link.href);
                        }}
                        onMouseLeave={() => {
                          dropdownTimeoutRef.current = setTimeout(() => {
                            setStayDropdownOpen(false);
                            setHoveredLink(null);
                          }, 150);
                        }}
                      >
                        <button
                          className="relative px-4 py-2 text-sm font-medium transition-colors duration-300 flex items-center gap-1"
                        >
                          <span
                            className={`relative z-10 transition-colors duration-300 ${
                              isActive ? "text-primary" : isHovered ? "text-primary" : "text-navy"
                            }`}
                          >
                            {link.label}
                          </span>
                          <motion.span
                            animate={{ rotate: stayDropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10"
                          >
                            <ChevronDown size={14} className={`transition-colors duration-300 ${isActive || isHovered ? "text-primary" : "text-navy/60"}`} />
                          </motion.span>

                          <AnimatePresence>
                            {(isActive || isHovered) && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 bg-primary/5 rounded-lg"
                              />
                            )}
                          </AnimatePresence>

                          {isActive && (
                            <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-primary-light rounded-full" />
                          )}
                        </button>

                        {/* Dropdown panel */}
                        <AnimatePresence>
                          {stayDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                            >
                              <div className="py-2">
                                {link.children!.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 hover:bg-primary/5 ${
                                      pathname === child.href ? "text-primary font-medium bg-primary/5" : "text-navy hover:text-primary"
                                    }`}
                                  >
                                    <span>{child.label}</span>
                                    <ArrowRight size={14} className="opacity-50" />
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  }

                  // Silver Building link with special styling
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onMouseEnter={() => setHoveredLink(link.href)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className={`relative px-4 py-2 text-sm transition-colors duration-300 ${isSilver ? "font-semibold" : "font-medium"}`}
                      >
                        <span
                          className={`relative z-10 transition-colors duration-300 ${
                            isActive
                              ? isSilver ? "text-slate-500" : "text-primary"
                              : isHovered
                              ? isSilver ? "text-slate-500" : "text-primary"
                              : isSilver ? "text-slate-600" : "text-navy"
                          }`}
                        >
                          {isSilver ? (
                            <span className="flex items-center gap-1">
                              {link.label}
                              <Sparkles size={12} className="text-slate-400" />
                            </span>
                          ) : (
                            link.label
                          )}
                        </span>

                        <AnimatePresence>
                          {(isActive || isHovered) && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`absolute inset-0 rounded-lg ${isSilver ? "bg-slate-500/5" : "bg-primary/5"}`}
                            />
                          )}
                        </AnimatePresence>

                        {isActive && (
                          <span className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${
                            isSilver
                              ? "bg-gradient-to-r from-slate-400 to-slate-300"
                              : "bg-gradient-to-r from-primary to-primary-light"
                          }`} />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Desktop WhatsApp */}
              <motion.a
                href="https://wa.me/917816055655?text=Hi%2C%20I%20am%20interested%20in%20booking%20a%20room%20at%20Murams%20Living."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="hidden lg:flex items-center gap-2 px-5 py-3 bg-[#25D366] text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-[#1db954] transition-colors duration-200"
              >
                <FaWhatsapp size={16} />
                <span>WhatsApp</span>
              </motion.a>

              {/* Desktop Book Now */}
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
                {navLinks.map((link, index) => {
                  const hasChildren = !!link.children;
                  const isSilver = link.href === "/silver";

                  // Dropdown parent in mobile
                  if (hasChildren) {
                    return (
                      <motion.li
                        key={link.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => setMobileStayOpen(!mobileStayOpen)}
                          className="flex items-center justify-between w-full px-4 py-4 rounded-xl font-medium text-navy hover:bg-surface-secondary hover:text-primary transition-all duration-300"
                        >
                          <span>{link.label}</span>
                          <motion.span
                            animate={{ rotate: mobileStayOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={16} className="text-primary/50" />
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {mobileStayOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {link.children!.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={`flex items-center justify-between pl-8 pr-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                      pathname === child.href
                                        ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-soft"
                                        : "text-navy/70 hover:bg-surface-secondary hover:text-primary"
                                    }`}
                                  >
                                    <span>{child.label}</span>
                                    <ArrowRight size={14} className={pathname === child.href ? "text-white/70" : "text-primary/50"} />
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  }

                  // Regular link (with Silver Building special styling)
                  return (
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
                            ? isSilver
                              ? "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-soft"
                              : "bg-gradient-to-r from-primary to-primary-dark text-white shadow-soft"
                            : isSilver
                            ? "text-slate-600 hover:bg-slate-50 hover:text-slate-700 font-semibold"
                            : "text-navy hover:bg-surface-secondary hover:text-primary"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {link.label}
                          {isSilver && <Sparkles size={14} className={pathname === link.href ? "text-white/70" : "text-slate-400"} />}
                        </span>
                        <ArrowRight size={16} className={pathname === link.href ? "text-white/70" : isSilver ? "text-slate-400" : "text-primary/50"} />
                      </Link>
                    </motion.li>
                  );
                })}
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
