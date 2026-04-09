"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  as?: keyof JSX.IntrinsicElements;
}

export default function AnimatedText({
  children,
  className = "",
  delay = 0,
  direction = "up",
  as: Tag = "div",
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const fromVars: gsap.TweenVars = { opacity: 0 };

    if (direction === "up") fromVars.y = 30;
    if (direction === "down") fromVars.y = -30;
    if (direction === "left") fromVars.x = -30;
    if (direction === "right") fromVars.x = 30;

    gsap.from(ref.current, {
      ...fromVars,
      duration: 0.8,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 88%",
        once: true,
      },
    });
  }, []);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
