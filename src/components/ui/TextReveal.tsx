'use client';

import { useRef, ReactNode, useState, useEffect } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

type RevealType = 'words' | 'chars' | 'lines';

interface TextRevealProps {
  children: string;
  type?: RevealType;
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  highlightWords?: string[];
  highlightClassName?: string;
}

const charVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: -90 },
  visible: { opacity: 1, y: 0, rotateX: 0 },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function TextReveal({
  children,
  type = 'words',
  delay = 0,
  duration = 0.5,
  stagger = 0.03,
  once = true,
  className = '',
  as: Component = 'div',
  highlightWords = [],
  highlightClassName = 'text-primary',
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const getVariants = () => {
    switch (type) {
      case 'chars':
        return charVariants;
      case 'lines':
        return lineVariants;
      default:
        return wordVariants;
    }
  };

  const renderContent = () => {
    if (type === 'chars') {
      return children.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={getVariants()}
          transition={{
            duration,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ));
    }

    if (type === 'lines') {
      return children.split('\n').map((line, i) => (
        <motion.span
          key={i}
          variants={getVariants()}
          transition={{
            duration,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'block' }}
        >
          {line}
        </motion.span>
      ));
    }

    // Words
    return children.split(' ').map((word, i) => {
      const isHighlighted = highlightWords.some(
        (hw) => word.toLowerCase().includes(hw.toLowerCase())
      );
      return (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <motion.span
            variants={getVariants()}
            transition={{
              duration,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: 'inline-block' }}
            className={isHighlighted ? highlightClassName : ''}
          >
            {word}
          </motion.span>
          {i < children.split(' ').length - 1 && '\u00A0'}
        </span>
      );
    });
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
      style={{ perspective: '1000px' }}
    >
      <Component className={className} style={{ margin: 0 }}>
        {renderContent()}
      </Component>
    </motion.div>
  );
}

// Typing animation component
interface TypingTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  cursor?: boolean;
  onComplete?: () => void;
}

export function TypingText({
  text,
  delay = 0,
  speed = 0.05,
  className = '',
  cursor = true,
  onComplete,
}: TypingTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={className}>
      {isInView &&
        text.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0,
              delay: delay + i * speed,
            }}
            onAnimationComplete={i === text.length - 1 ? onComplete : undefined}
          >
            {char}
          </motion.span>
        ))}
      {cursor && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: delay + text.length * speed,
          }}
          className="text-primary"
        >
          |
        </motion.span>
      )}
    </span>
  );
}

// Counter animation component
interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [displayed, setDisplayed] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    let rafId: number;
    let startTimestamp: number | null = null;
    const totalMs = duration * 1000;
    const delayMs = delay * 1000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp - delayMs;

      if (elapsed < 0) {
        rafId = requestAnimationFrame(step);
        return;
      }

      const progress = Math.min(elapsed / totalMs, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(from + (to - from) * eased);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplayed(to);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, from, to, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayed.toFixed(decimals)}{suffix}
    </span>
  );
}
