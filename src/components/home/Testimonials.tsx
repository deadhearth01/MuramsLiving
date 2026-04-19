"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, GraduationCap, Briefcase } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  type: "student" | "professional";
  rating: number;
  text: string;
  stayDuration: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Medical Student, Gitam",
    type: "student",
    rating: 5,
    text: "Murams Living has been my home away from home for the past 2 years. The proximity to my college, delicious home-cooked food, and the secure environment give my parents peace of mind. The staff is incredibly supportive!",
    stayDuration: "2+ years",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Rahul Reddy",
    role: "Software Engineer, TCS",
    type: "professional",
    rating: 5,
    text: "As an IT professional, I needed a place with reliable WiFi and a peaceful environment to work from. Murams Living delivers on both. The beach view from the terrace is perfect for unwinding after work.",
    stayDuration: "8 months",
    avatar: "RR",
  },
  {
    id: 3,
    name: "Anjali Patel",
    role: "MBBS Intern",
    type: "student",
    rating: 5,
    text: "The 24/7 hot water and flexible meal timings are a blessing during my demanding hospital shifts. The housekeeping staff keeps everything spotless. Best decision I made for my accommodation!",
    stayDuration: "1 year",
    avatar: "AP",
  },
  {
    id: 4,
    name: "Karthik Nair",
    role: "Data Analyst, Wipro",
    type: "professional",
    rating: 5,
    text: "I've stayed at multiple PGs before, but Murams Living is different. The new building, modern amenities, and the community feel make it stand out. Highly recommend for working professionals!",
    stayDuration: "6 months",
    avatar: "KN",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const goToSlide = (index: number) => {
    setAutoplay(false);
    setActiveIndex(index);
  };

  const nextSlide = () => {
    setAutoplay(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setAutoplay(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 lg:py-32 bg-surface-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-navy/3 rounded-full blur-[100px] -translate-x-1/2" />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
            Resident Reviews
          </p>

          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy mb-6">
            Don&apos;t take our word for it.
          </h2>

          <p className="text-text-secondary text-lg">
            Here&apos;s what students and working professionals living at
            Murams Living have to say about their experience.
          </p>
        </AnimatedSection>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl p-8 lg:p-12 shadow-soft relative"
              >
                {/* Quote icon */}
                <div className="absolute top-8 right-8 lg:top-12 lg:right-12">
                  <Quote size={48} className="text-primary/10" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl lg:text-2xl text-navy font-medium leading-relaxed mb-8 pr-8">
                  "{testimonials[activeIndex].text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[activeIndex].avatar}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-heading font-bold text-navy text-lg">
                        {testimonials[activeIndex].name}
                      </h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        testimonials[activeIndex].type === "student" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {testimonials[activeIndex].type === "student" 
                          ? <><GraduationCap size={12} /> Student</> 
                          : <><Briefcase size={12} /> Professional</>
                        }
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>

                  {/* Stay Duration Badge */}
                  <div className="hidden sm:block text-right">
                    <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Stay Duration</div>
                    <div className="text-primary font-semibold">
                      {testimonials[activeIndex].stayDuration}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-6">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-6">
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex 
                    ? "w-8 h-2 bg-primary" 
                    : "w-2 h-2 bg-navy/20 hover:bg-navy/40"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <AnimatedSection delay={0.3} className="mt-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "100+", label: "Happy Residents" },
              { value: "4.6/5", label: "Average Rating" },
              { value: "3+", label: "Years Trusted" },
              { value: "95%", label: "Recommend Us" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-navy mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
