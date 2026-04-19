"use client";

import { motion } from "framer-motion";
import {
  Moon,
  Archive,
  Wind,
  Tv,
  Lock,
  UtensilsCrossed,
  Wifi,
  Sun,
  Droplets,
  Zap,
  Shield,
  Building2,
  WashingMachine,
  ShirtIcon,
  ParkingCircle,
  MoveUp,
  Sunset,
  Users,
  Sparkles,
  Phone,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const amenityCategories = [
  {
    label: "Room Comforts",
    eyebrow: "Living",
    color: "text-blue-500",
    iconBg: "bg-blue-50",
    items: [
      {
        icon: Moon,
        title: "Premium Beds",
        desc: "High-quality mattresses designed for deep, restful sleep after long study or work sessions.",
      },
      {
        icon: Archive,
        title: "Individual Cupboards",
        desc: "Each resident gets a dedicated, lockable storage cupboard for personal belongings.",
      },
      {
        icon: Wind,
        title: "Air Conditioning",
        desc: "Select rooms come with modern A/C units for a perfectly climate-controlled environment.",
      },
      {
        icon: Tv,
        title: "TV Entertainment",
        desc: "Cable TV available in common areas and select rooms for relaxation after a busy day.",
      },
      {
        icon: Lock,
        title: "Secure Lockers",
        desc: "Personal lockers available for storing valuables securely within the premises.",
      },
    ],
  },
  {
    label: "Food & Dining",
    eyebrow: "Nutrition",
    color: "text-orange-500",
    iconBg: "bg-orange-50",
    items: [
      {
        icon: UtensilsCrossed,
        title: "Home-Cooked Meals",
        desc: "Fresh, nutritious home-style Indian meals served three times daily — breakfast, lunch, and dinner.",
      },
      {
        icon: Sparkles,
        title: "Hygienic Kitchen",
        desc: "Our kitchen maintains the highest standards of hygiene and cleanliness, cooked by trained staff.",
      },
    ],
  },
  {
    label: "Utilities & Tech",
    eyebrow: "Connectivity",
    color: "text-purple-500",
    iconBg: "bg-purple-50",
    items: [
      {
        icon: Wifi,
        title: "Free Wifi",
        desc: "Blazing fast broadband internet throughout the premises for seamless study, work, and entertainment.",
      },
      {
        icon: Sun,
        title: "Solar Water Heating",
        desc: "Eco-friendly solar water heating system ensures 24/7 availability of hot water.",
      },
      {
        icon: Droplets,
        title: "24/7 Hot Water",
        desc: "Uninterrupted hot water supply round the clock so you never have to wait for a warm shower.",
      },
      
    ],
  },
  {
    label: "Security & Safety",
    eyebrow: "Protection",
    color: "text-red-500",
    iconBg: "bg-red-50",
    items: [
      {
        icon: Shield,
        title: "24/7 Security Guards",
        desc: "Trained security personnel on duty round the clock at all entry and exit points.",
      },
      {
        icon: Building2,
        title: "CCTV Surveillance",
        desc: "Comprehensive CCTV coverage throughout common areas, corridors, and entry points.",
      },
      {
        icon: Lock,
        title: "Biometric Access",
        desc: "Bio-metric thumb reader system for secure and convenient access control.",
      },
    ],
  },
  {
    label: "Convenience",
    eyebrow: "Facilities",
    color: "text-green-500",
    iconBg: "bg-green-50",
    items: [
      {
        icon: WashingMachine,
        title: "Washing Machines",
        desc: "On-site washing machines available for residents to do their laundry conveniently.",
      },
      {
        icon: ShirtIcon,
        title: "Dhobi / Laundry",
        desc: "Professional laundry and ironing service available for a nominal charge.",
      },
      {
        icon: Sparkles,
        title: "Daily Housekeeping",
        desc: "Professional housekeeping staff clean rooms and common areas every day.",
      },
      {
        icon: ParkingCircle,
        title: "Covered Bike Parking",
        desc: "Secure, covered parking facility for motorcycles and bicycles.",
      },
      {
        icon: MoveUp,
        title: "Elevator / Lift",
        desc: "Modern elevator for easy movement between floors with your belongings.",
      },
      {
        icon: Sunset,
        title: "Beach View Terrace",
        desc: "Beautiful terrace with a stunning view of Rushikonda Beach — perfect for sunrise and sunset.",
      },
      {
        icon: Users,
        title: "Common Areas",
        desc: "Spacious common rooms and lounges for residents to relax, socialize, and unwind.",
      },
    ],
  },
];

export default function AmenitiesPageClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <section className="py-20 md:py-28 bg-navy-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container-custom relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              Amenities & Facilities
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-5 leading-tight">
              Premium Amenities
            </h1>
            <p className="text-white/65 text-lg leading-relaxed">
              Everything you need for a comfortable, convenient, and enjoyable
              stay — all included at Murams Living.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick overview chips */}
      <div className="border-b border-gray-100 py-5 bg-white sticky top-[72px] z-20">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2">
            {amenityCategories.map((cat) => (
              <a
                key={cat.label}
                href={`#${cat.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs font-medium text-text-secondary hover:text-primary border border-gray-200 hover:border-primary/30 px-3 py-1.5 rounded-full transition-all"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Amenity sections */}
      {amenityCategories.map((cat, catIndex) => (
        <section
          key={cat.label}
          id={cat.label.toLowerCase().replace(/\s+/g, "-")}
          className={`py-16 lg:py-20 ${catIndex % 2 === 0 ? "bg-white" : "bg-surface-secondary"}`}
        >
          <div className="container-custom">
            <AnimatedSection className="mb-10">
              <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
                {cat.eyebrow}
              </p>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-navy">
                {cat.label}
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((item, idx) => (
                <AnimatedSection key={item.title} delay={idx * 0.06}>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full group hover:shadow-md transition-all duration-300">
                    <div
                      className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center mb-4`}
                    >
                      <item.icon size={20} className={cat.color} />
                    </div>
                    <h3 className="font-heading font-bold text-navy mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-navy">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <AnimatedSection>
            <h2 className="font-heading font-bold text-3xl text-white mb-4">
              Experience These Amenities Yourself
            </h2>
            <p className="text-white/60 mb-8">
              Come visit Murams Living and see all our facilities in person.
              Call us to schedule a tour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+917816055655"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-xl transition-all"
              >
                <Phone size={18} />
                Call: +91 7816055655
              </a>
              <a
                href="https://wa.me/917816055655?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Murams%20Living%20amenities."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
              >
                WhatsApp Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
