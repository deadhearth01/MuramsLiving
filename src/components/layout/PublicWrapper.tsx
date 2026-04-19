"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import StickySidebar from "./StickySidebar";

function MobileFloatingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.75);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[100] md:hidden"
        >
          {/* Frosted glass container */}
          <div className="flex gap-2.5 bg-white/25 backdrop-blur-xl rounded-[20px] p-2 border border-white/30 shadow-2xl shadow-black/20">
            <a
              href="https://wa.me/917816055655?text=Hi%2C%20I%20am%20interested%20in%20booking%20a%20room%20at%20Murams%20Living."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 font-semibold text-sm rounded-2xl shadow-md shadow-green-500/30 active:scale-95 transition-transform"
            >
              <FaWhatsapp size={19} />
              WhatsApp
            </a>
            <Link
              href="/book"
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3.5 font-semibold text-sm rounded-2xl shadow-md shadow-primary/30 active:scale-95 transition-transform"
            >
              <CalendarCheck size={17} />
              Book Now
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PublicWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminOrAuth = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isAdminOrAuth) return <>{children}</>;

  return (
    <>
      <Header />
      {children}
      <StickySidebar />
      <Footer />
      {/* Bottom spacer so footer isn't hidden behind floating bar on mobile */}
      <div className="h-20 md:hidden" aria-hidden="true" />
      <MobileFloatingBar />
    </>
  );
}
