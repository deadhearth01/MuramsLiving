'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface ScrollProgressProps {
  variant?: 'bar' | 'circle' | 'dots';
  position?: 'top' | 'bottom' | 'left' | 'right';
  color?: string;
  size?: number;
  showPercentage?: boolean;
  className?: string;
}

export default function ScrollProgress({
  variant = 'bar',
  position = 'top',
  color = 'var(--primary)',
  size = 4,
  showPercentage = false,
  className = '',
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (variant === 'bar') {
    const positionClasses = {
      top: 'top-0 left-0 right-0',
      bottom: 'bottom-0 left-0 right-0',
      left: 'top-0 bottom-0 left-0',
      right: 'top-0 bottom-0 right-0',
    };

    const isVertical = position === 'left' || position === 'right';

    return (
      <motion.div
        className={`fixed z-[100] ${positionClasses[position]} ${className}`}
        style={{
          height: isVertical ? '100%' : size,
          width: isVertical ? size : '100%',
          background: color,
          transformOrigin: isVertical ? 'top' : 'left',
          scaleX: isVertical ? 1 : scaleX,
          scaleY: isVertical ? scaleX : 1,
        }}
      />
    );
  }

  if (variant === 'circle') {
    return <CircleProgress color={color} showPercentage={showPercentage} />;
  }

  if (variant === 'dots') {
    return <DotsProgress color={color} />;
  }

  return null;
}

// Circle progress indicator
function CircleProgress({
  color,
  showPercentage,
}: {
  color: string;
  showPercentage: boolean;
}) {
  const { scrollYProgress } = useScroll();
  const [percentage, setPercentage] = useState(0);

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setPercentage(Math.round(v * 100));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-[100]"
    >
      <div className="relative w-14 h-14">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(26, 46, 90, 0.1)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              pathLength,
              strokeDasharray: '283',
              strokeDashoffset: '283',
            }}
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-navy">{percentage}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Dots progress indicator
function DotsProgress({ color }: { color: string }) {
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState(0);
  const sections = 5;

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setActiveSection(Math.min(Math.floor(v * sections), sections - 1));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3">
      {Array.from({ length: sections }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: i === activeSection ? 1.2 : 1,
            opacity: i <= activeSection ? 1 : 0.3,
            backgroundColor: i <= activeSection ? color : 'rgba(26, 46, 90, 0.2)',
          }}
          className="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300"
          onClick={() => {
            window.scrollTo({
              top: (i / sections) * document.body.scrollHeight,
              behavior: 'smooth',
            });
          }}
        />
      ))}
    </div>
  );
}

// Back to top button
interface BackToTopProps {
  showAfter?: number;
  className?: string;
}

export function BackToTop({ showAfter = 400, className = '' }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50
        w-12 h-12 rounded-full
        bg-gradient-to-br from-primary to-primary-dark
        text-white shadow-glow
        flex items-center justify-center
        hover:scale-110 transition-transform duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${!isVisible ? 'pointer-events-none' : ''}
        ${className}
      `}
      aria-label="Back to top"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </motion.button>
  );
}

// Scroll indicator (for hero sections)
interface ScrollIndicatorProps {
  className?: string;
  text?: string;
}

export function ScrollIndicator({
  className = '',
  text = 'Scroll to explore',
}: ScrollIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className={`flex flex-col items-center gap-3 ${className}`}
    >
      <span className="text-sm font-medium text-white/70">{text}</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
      >
        <motion.div
          animate={{ opacity: [1, 0], y: [0, 12] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-white"
        />
      </motion.div>
    </motion.div>
  );
}
