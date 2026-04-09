import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E8601C",
          50: "#FFF7F3",
          100: "#FFEDE5",
          200: "#FFD4C2",
          300: "#FFB799",
          400: "#F4845F",
          light: "#F4845F",
          dark: "#C44E0E",
          600: "#C44E0E",
          700: "#A33D0A",
          800: "#7A2E07",
          900: "#521F05",
        },
        navy: {
          DEFAULT: "#1A2E5A",
          50: "#F0F3F9",
          100: "#D9E0ED",
          200: "#B3C1DB",
          300: "#8DA2C9",
          400: "#4D6A9E",
          light: "#2A4A8A",
          dark: "#0F1C38",
          700: "#0F1C38",
          800: "#0A1326",
          900: "#050914",
        },
        cream: {
          DEFAULT: "#FFF8F5",
          50: "#FFFFFF",
          100: "#FFF8F5",
          200: "#FFEDE5",
          300: "#FFE0D4",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8FAFC",
          tertiary: "#F1F5F9",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-bricolage)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["5rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-xl": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading": ["2rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-sm": ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body": ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        "caption": ["0.75rem", { lineHeight: "1.5" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "soft": "0 2px 8px -2px rgba(26, 46, 90, 0.08)",
        "soft-md": "0 4px 16px -4px rgba(26, 46, 90, 0.1)",
        "soft-lg": "0 8px 32px -8px rgba(26, 46, 90, 0.12)",
        "soft-xl": "0 16px 48px -12px rgba(26, 46, 90, 0.15)",
        "glow": "0 0 40px -10px rgba(232, 96, 28, 0.4)",
        "glow-lg": "0 0 60px -15px rgba(232, 96, 28, 0.5)",
        "inner-soft": "inset 0 2px 4px 0 rgba(26, 46, 90, 0.06)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-down": "fadeDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-slow": "fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-left": "slideInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slideInRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "marquee": "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
        "text-reveal": "textReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "blur-in": "blurIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "draw-line": "drawLine 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-60px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(60px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        textReveal: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blurIn: {
          "0%": { opacity: "0", filter: "blur(10px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
        drawLine: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 30%, #1A2E5A 70%, #0F1C38 100%)",
        "hero-radial": "radial-gradient(ellipse at center, rgba(232, 96, 28, 0.15) 0%, transparent 70%)",
        "orange-gradient": "linear-gradient(135deg, #E8601C 0%, #F4845F 100%)",
        "navy-gradient": "linear-gradient(135deg, #1A2E5A 0%, #0F1C38 100%)",
        "glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        "glass-dark": "linear-gradient(135deg, rgba(15, 28, 56, 0.8) 0%, rgba(26, 46, 90, 0.6) 100%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        "dots": "radial-gradient(circle, rgba(232, 96, 28, 0.15) 1px, transparent 1px)",
        "grid": "linear-gradient(rgba(26, 46, 90, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 46, 90, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dots": "24px 24px",
        "grid": "48px 48px",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "snap": "cubic-bezier(0.5, 0, 0.1, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
      },
      scale: {
        "102": "1.02",
        "103": "1.03",
        "98": "0.98",
        "97": "0.97",
      },
      blur: {
        "xs": "2px",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [],
};

export default config;
