"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const MIN_DURATION = 600;

export default function SitePreloader() {
  const pathname = usePathname();
  const isAdminOrAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/login");

  const [visible, setVisible] = useState(!isAdminOrAuth);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isAdminOrAuth) {
      setVisible(false);
      return;
    }

    const start = performance.now();
    let raf = 0;
    let done = false;

    const tick = () => {
      const elapsed = performance.now() - start;
      const ready = document.readyState === "complete";
      const timePct = Math.min(elapsed / MIN_DURATION, 1);
      const target = ready ? 1 : Math.min(timePct, 0.9);
      setProgress((p) => p + (target - p) * 0.15);

      if (ready && elapsed >= MIN_DURATION) {
        setProgress(1);
        done = true;
        setTimeout(() => setVisible(false), 250);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const onLoad = () => {
      if (!done) tick();
    };
    window.addEventListener("load", onLoad);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, [isAdminOrAuth]);

  const R = 46;
  const CIRC = 2 * Math.PI * R;
  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy to-navy-dark"
        >
          <div className="relative flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg
                className="absolute inset-0 -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke="#E8601C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  animate={{ strokeDashoffset: CIRC * (1 - progress) }}
                  transition={{ duration: 0.2, ease: "linear" }}
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(232,96,28,0.6))",
                  }}
                />
              </svg>
              <div className="relative w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center p-3 border border-white/10">
                <Image
                  src="/logo.png"
                  alt="Murams Living"
                  width={80}
                  height={80}
                  priority
                  className="object-contain"
                />
              </div>
            </div>
            <p className="mt-6 text-white/60 text-xs font-medium tracking-[0.25em] uppercase">
              Murams Living
            </p>
            <p className="mt-2 text-white/30 text-[10px] tabular-nums">
              {pct}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
