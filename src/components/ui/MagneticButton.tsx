'use client';

import { useRef, useState, ReactNode, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  magnetic?: boolean;
  magneticStrength?: number;
  external?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  magnetic = true,
  magneticStrength = 0.3,
  external = false,
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'right',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!magnetic || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * magneticStrength);
    y.set(distanceY * magneticStrength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-[0.9375rem]',
    lg: 'px-9 py-4 text-base',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-br from-primary to-primary-dark text-white shadow-soft hover:shadow-glow',
    secondary: 'bg-navy text-white shadow-soft hover:bg-navy-dark',
    outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
    ghost: 'bg-transparent text-navy hover:bg-surface-secondary',
  };

  const baseClasses = `
    relative inline-flex items-center justify-center gap-2.5
    font-semibold rounded-xl cursor-pointer
    transition-all duration-400 ease-smooth
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <motion.span
          animate={{ x: isHovered ? -3 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <motion.span
          animate={{ x: isHovered ? 3 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.span>
      )}
    </>
  );

  const motionProps = {
    ref,
    style: { x: xSpring, y: ySpring },
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: handleMouseLeave,
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  };

  if (href) {
    if (external) {
      return (
        <motion.div {...motionProps} className="inline-block">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
          >
            {content}
          </a>
        </motion.div>
      );
    }

    return (
      <motion.div {...motionProps} className="inline-block">
        <Link href={href} className={baseClasses}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div {...motionProps} className="inline-block">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={baseClasses}
      >
        {content}
      </button>
    </motion.div>
  );
}

// Icon Button variant
interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  magnetic?: boolean;
}

export function IconButton({
  icon,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  label,
  magnetic = true,
}: IconButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!magnetic || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-soft hover:shadow-glow',
    secondary: 'bg-navy text-white hover:bg-navy-dark',
    outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
    ghost: 'bg-surface-secondary text-navy hover:bg-surface-tertiary hover:text-primary',
  };

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-full cursor-pointer
    transition-all duration-300 ease-smooth
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  const content = (
    <motion.div
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      {href ? (
        <Link href={href} className={baseClasses} aria-label={label}>
          {icon}
        </Link>
      ) : (
        <button onClick={onClick} className={baseClasses} aria-label={label}>
          {icon}
        </button>
      )}
    </motion.div>
  );

  return content;
}

// Floating action button
interface FABProps {
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  label?: string;
}

export function FAB({
  icon,
  onClick,
  href,
  position = 'bottom-right',
  className = '',
  label,
}: FABProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
    >
      <IconButton
        icon={icon}
        onClick={onClick}
        href={href}
        variant="primary"
        size="lg"
        label={label}
      />
    </motion.div>
  );
}
