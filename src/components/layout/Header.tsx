"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import TopBar from "./TopBar";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
      <TopBar />
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-2xl md:text-3xl text-[#E8601C]">
                  Murams
                </span>
                <span className="font-heading font-semibold text-sm md:text-base text-[#1A2E5A] tracking-widest -mt-1">
                  LIVING
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-[#E8601C] active"
                      : "text-[#1A2E5A] hover:text-[#E8601C]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+917816055655"
                className="hidden md:flex btn-primary text-sm py-2.5 px-5"
              >
                <Phone size={15} />
                Call Now
              </a>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-lg text-[#1A2E5A] hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] backdrop-blur-menu bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 z-[70] h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-2xl text-[#E8601C]">
              Murams
            </span>
            <span className="font-heading font-semibold text-xs text-[#1A2E5A] tracking-widest">
              LIVING
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-4 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl mb-1 font-medium transition-all ${
                pathname === link.href
                  ? "bg-[#E8601C] text-white"
                  : "text-[#1A2E5A] hover:bg-[#FFF8F5] hover:text-[#E8601C]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-5 border-t border-gray-100 space-y-3">
          <a
            href="tel:+917816055655"
            className="flex items-center justify-center gap-2 w-full btn-primary text-sm"
          >
            <Phone size={15} />
            +91 7816055655
          </a>
          <a
            href="tel:+917842222284"
            className="flex items-center justify-center gap-2 w-full btn-outline text-sm"
          >
            <Phone size={15} />
            +91 7842222284
          </a>
        </div>
      </div>
    </>
  );
}
