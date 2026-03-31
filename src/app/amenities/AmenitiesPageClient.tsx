"use client";

import { motion } from "framer-motion";
import {
  Moon,
  Archive,
  Wind,
  Tv,
  Sun,
  UtensilsCrossed,
  WashingMachine,
  Sunset,
  ShirtIcon,
  Wifi,
  Shield,
  Droplets,
  ParkingCircle,
  MoveUp,
  Sparkles,
  Building2,
  Users,
  Lock,
  Zap,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { Phone } from "lucide-react";

const amenityCategories = [
  {
    category: "Room Comforts",
    eyebrow: "Living",
    color: "text-blue-500",
    bg: "bg-blue-50",
    items: [
      {
        icon: <Moon size={28} />,
        title: "Premium Beds",
        description:
          "High-quality mattresses and comfortable beds designed for deep, restful sleep after long study or work sessions.",
      },
      {
        icon: <Archive size={28} />,
        title: "Individual Cupboards",
        description:
          "Each resident gets a dedicated, lockable storage cupboard for personal belongings and valuables.",
      },
      {
        icon: <Wind size={28} />,
        title: "Air Conditioning",
        description:
          "Select rooms come with modern air conditioning units for a perfectly climate-controlled environment.",
      },
      {
        icon: <Tv size={28} />,
        title: "TV Entertainment",
        description:
          "Cable TV available in common areas and select rooms for relaxation and entertainment after a busy day.",
      },
      {
        icon: <Lock size={28} />,
        title: "Secure Lockers",
        description:
          "Personal lockers available for storing valuables securely within the premises.",
      },
    ],
  },
  {
    category: "Food & Dining",
    eyebrow: "Nutrition",
    color: "text-orange-500",
    bg: "bg-orange-50",
    items: [
      {
        icon: <UtensilsCrossed size={28} />,
        title: "Home-Cooked Meals",
        description:
          "Fresh, nutritious home-style Indian meals served three times daily — breakfast, lunch, and dinner.",
      },
      {
        icon: <Sparkles size={28} />,
        title: "Hygienic Kitchen",
        description:
          "Our kitchen maintains the highest standards of hygiene and cleanliness, cooked by trained kitchen staff.",
      },
    ],
  },
  {
    category: "Utilities & Tech",
    eyebrow: "Connectivity",
    color: "text-purple-500",
    bg: "bg-purple-50",
    items: [
      {
        icon: <Wifi size={28} />,
        title: "High-Speed WiFi",
        description:
          "Blazing fast broadband internet throughout the premises for seamless study, work, and entertainment.",
      },
      {
        icon: <Sun size={28} />,
        title: "Solar Water Heating",
        description:
          "Eco-friendly solar water heating system ensures 24/7 availability of hot water.",
      },
      {
        icon: <Droplets size={28} />,
        title: "24/7 Hot Water",
        description:
          "Uninterrupted hot water supply round the clock so you never have to wait for a warm shower.",
      },
      {
        icon: <Zap size={28} />,
        title: "Power Backup",
        description:
          "Generator backup ensures uninterrupted power supply during outages.",
      },
    ],
  },
  {
    category: "Security & Safety",
    eyebrow: "Protection",
    color: "text-red-500",
    bg: "bg-red-50",
    items: [
      {
        icon: <Shield size={28} />,
        title: "24/7 Security Guards",
        description:
          "Trained security personnel on duty round the clock at all entry and exit points.",
      },
      {
        icon: <Building2 size={28} />,
        title: "CCTV Surveillance",
        description:
          "Comprehensive CCTV camera coverage throughout common areas, corridors, and entry points.",
      },
      {
        icon: <Lock size={28} />,
        title: "Biometric Access",
        description:
          "Bio-metric thumb reader system for secure and convenient access control.",
      },
    ],
  },
  {
    category: "Convenience",
    eyebrow: "Facilities",
    color: "text-green-500",
    bg: "bg-green-50",
    items: [
      {
        icon: <WashingMachine size={28} />,
        title: "Washing Machines",
        description:
          "On-site washing machines available for residents to do their laundry conveniently.",
      },
      {
        icon: <ShirtIcon size={28} />,
        title: "Dhobi / Laundry",
        description:
          "Professional laundry and ironing service available for a nominal charge.",
      },
      {
        icon: <Sparkles size={28} />,
        title: "Daily Housekeeping",
        description:
          "Professional housekeeping staff clean rooms and common areas every day.",
      },
      {
        icon: <ParkingCircle size={28} />,
        title: "Covered Bike Parking",
        description:
          "Secure, covered parking facility for motorcycles and bicycles.",
      },
      {
        icon: <MoveUp size={28} />,
        title: "Elevator / Lift",
        description:
          "Modern elevator facility for easy movement between floors with your belongings.",
      },
      {
        icon: <Sunset size={28} />,
        title: "Beach View Terrace",
        description:
          "Beautiful terrace with a stunning view of Rushikonda Beach — perfect for sunrise and sunset.",
      },
      {
        icon: <Users size={28} />,
        title: "Common Areas",
        description:
          "Spacious common rooms and lounges for residents to relax, socialize, and unwind.",
      },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AmenitiesPageClient() {
  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 50%, #2A1A0E 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#E8601C]" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#F4845F]" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-[#E8601C]/20 border border-[#E8601C]/30 text-[#F4845F] text-xs font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            Amenities & Facilities
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4"
          >
            Premium{" "}
            <span className="gradient-text">Amenities</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Everything you need for a comfortable, convenient, and enjoyable
            stay — all included at Murams Living.
          </motion.p>
        </div>
      </section>

      {/* Amenities Categories */}
      {amenityCategories.map((category, catIndex) => (
        <section
          key={category.category}
          className={`section-padding ${catIndex % 2 === 0 ? "bg-white" : "bg-[#FFF8F5]"}`}
        >
          <div className="container-custom">
            <SectionTitle
              eyebrow={category.eyebrow}
              title={category.category}
              centered
            />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {category.items.map((item) => (
                <motion.div
                  key={item.title}
                  variants={cardVariants}
                  whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(232, 96, 28, 0.12)" }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm group transition-all duration-300"
                >
                  <div className="icon-ring mb-4 group-hover:!bg-gradient-to-br group-hover:from-[#E8601C] group-hover:to-[#F4845F] transition-all duration-300">
                    <span className="text-[#E8601C] group-hover:text-white transition-colors">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#1A2E5A] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section
        className="py-16 md:py-20"
        style={{
          background: "linear-gradient(135deg, #E8601C 0%, #C44E0E 100%)",
        }}
      >
        <div className="container-custom text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Experience These Amenities Yourself
          </h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto">
            Come visit Murams Living and see all our facilities in person. Call
            us to schedule a tour or to check room availability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+917816055655"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#E8601C] font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1"
            >
              <Phone size={18} />
              Call Us: +91 7816055655
            </a>
            <a
              href="https://wa.me/917816055655?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Murams%20Living%20amenities."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
