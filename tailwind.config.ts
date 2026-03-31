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
          light: "#F4845F",
          dark: "#C44E0E",
        },
        navy: {
          DEFAULT: "#1A2E5A",
          light: "#2A4A8A",
          dark: "#0F1C38",
        },
        cream: "#FFF8F5",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 40%, #2A1A0E 80%, #E8601C20 100%)",
        "orange-gradient":
          "linear-gradient(135deg, #E8601C 0%, #F4845F 100%)",
        "navy-gradient":
          "linear-gradient(135deg, #1A2E5A 0%, #0F1C38 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
