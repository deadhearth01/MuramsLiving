"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CalendarCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function StickySidebar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show sidebar after scrolling past the fold
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: isExpanded ? 0 : "-100%", opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] flex items-start drop-shadow-2xl h-auto hidden md:flex"
        >
          {/* Links Container */}
          <div className="flex flex-col items-center bg-white rounded-tr-lg rounded-br-lg overflow-hidden shadow-[4px_0_15px_rgba(0,0,0,0.15)] w-12">
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full h-12 bg-navy-dark text-white flex items-center justify-center hover:bg-navy-dark/90 transition-colors"
              aria-label="Collapse sidebar"
            >
              <ArrowLeft size={20} />
            </button>
            <Link
              href="/book"
              className="flex flex-col items-center justify-center py-5 px-2 bg-[#E8601C] hover:bg-[#c95116] transition-colors group w-full text-white border-b border-white/20"
            >
              <span className="text-[12px] font-semibold tracking-wider whitespace-nowrap mb-4" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                Book Now
              </span>
              <CalendarCheck size={18} className="group-hover:-translate-y-1 transition-transform" />
            </Link>
            
            <a
              href="https://wa.me/917816055655"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-4 px-2 bg-[#25D366] hover:bg-[#20bd5a] transition-colors group w-full text-white"
            >
              <FaWhatsapp size={22} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>

          {/* Toggle Button when collapsed */}
          <AnimatePresence>
            {!isExpanded && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => setIsExpanded(true)}
                className="absolute -right-12 top-0 w-12 h-12 bg-navy-dark text-white rounded-r-lg flex items-center justify-center border-y border-r border-white/10 hover:bg-navy-dark/90 transition-colors shadow-[4px_0_15px_rgba(0,0,0,0.15)] z-[101]"
                aria-label="Expand sidebar"
              >
                <ArrowRight size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
