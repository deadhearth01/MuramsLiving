"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "2020", suffix: "", label: "Year Established" },
  { value: "500", suffix: "+", label: "Happy Residents" },
  { value: "3", suffix: "", label: "Room Types" },
  { value: "10", suffix: "+", label: "Premium Amenities" },
];

const highlights = [
  "New fully-furnished building",
  "Marble flooring throughout",
  "A/C & Non-A/C room options",
  "Home-cooked healthy meals",
  "Stunning beach view from terrace",
  "Walking distance to IT companies",
];

export default function Welcome() {
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!statsRef.current) return;
    const counters = statsRef.current.querySelectorAll(".stat-count");
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target") || "0", 10);
      const suffix = counter.getAttribute("data-suffix") || "";
      gsap.from(counter, {
        innerText: 0,
        duration: 2,
        ease: "power2.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: counter,
          start: "top 85%",
          once: true,
        },
        onUpdate() {
          (counter as HTMLElement).innerText =
            Math.round(parseFloat((counter as HTMLElement).innerText)).toString() + suffix;
        },
        onComplete() {
          (counter as HTMLElement).innerText = target.toString() + suffix;
        },
      });
    });
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <SectionTitle
              eyebrow="Welcome to Murams Living"
              title="Your Home Away "
              highlight="From Home"
              description="At Murams Living, we believe that where you stay matters as much as where you work or study. Nestled in the beautiful coastal area of Rushikonda, Visakhapatnam, we offer a premium living experience that combines comfort, safety, and community."
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
            >
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 text-sm text-gray-700"
                >
                  <CheckCircle
                    size={17}
                    className="text-[#E8601C] shrink-0"
                  />
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a href="/about" className="btn-primary">
                Learn More About Us
              </a>
              <a href="tel:+917816055655" className="btn-outline">
                Book a Visit
              </a>
            </motion.div>
          </div>

          {/* Right: Stats grid */}
          <div ref={statsRef}>
            {/* Feature image placeholder */}
            <div className="relative mb-8">
              <div
                className="w-full h-56 md:h-64 rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #1A2E5A 0%, #E8601C 100%)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="font-heading text-5xl font-bold mb-2 opacity-30">
                      ML
                    </div>
                    <p className="text-white/60 text-sm">
                      Murams Living — Rushikonda
                    </p>
                  </div>
                </div>
                {/* Decorative shapes */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10" />
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/10" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#E8601C] text-white px-4 py-3 rounded-xl shadow-lg">
                <div className="font-heading font-bold text-xl">4.8★</div>
                <div className="text-xs opacity-90">Resident Rating</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#FFF8F5] rounded-2xl p-5 text-center"
                >
                  <div className="flex items-end justify-center gap-0.5">
                    <span
                      className="stat-count stat-number text-3xl"
                      data-target={stat.value}
                      data-suffix={stat.suffix}
                    >
                      {stat.value}
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
