"use client";

import { motion } from "framer-motion";
import {
  Users,
  Utensils,
  Shield,
  Sparkles,
  BedDouble,
  BedSingle,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

const rooms = [
  {
    icon: <BedDouble size={28} />,
    title: "Double Occupancy",
    beds: 2,
    description:
      "Spacious rooms designed for two residents with individual storage, comfortable beds, and shared amenities in a harmonious environment.",
    features: ["2 Comfortable Beds", "Individual Cupboards", "Shared Bathroom", "Study Desk"],
    color: "from-blue-500/10 to-blue-600/5",
    iconBg: "#1A2E5A",
  },
  {
    icon: <Users size={28} />,
    title: "Triple Occupancy",
    beds: 3,
    description:
      "Well-planned rooms accommodating three residents with smart space utilization, ample storage, and all essential amenities included.",
    features: ["3 Single Beds", "3 Cupboards", "Common Bathroom", "WiFi Included"],
    color: "from-orange-500/10 to-orange-600/5",
    iconBg: "#E8601C",
    popular: true,
  },
  {
    icon: <BedSingle size={28} />,
    title: "Quadruple Occupancy",
    beds: 4,
    description:
      "Budget-friendly option for four residents featuring bunk beds or single beds, individual storage space, and all shared facilities.",
    features: ["4 Single Beds", "Individual Storage", "Common Bathroom", "Cost Effective"],
    color: "from-green-500/10 to-green-600/5",
    iconBg: "#2A6049",
  },
  {
    icon: <Utensils size={28} />,
    title: "Healthy Food",
    beds: 0,
    description:
      "Enjoy nutritious, home-cooked Indian meals prepared fresh every day. Breakfast, lunch, and dinner included with all room packages.",
    features: ["3 Meals / Day", "Home-Cooked", "Hygienic Kitchen", "Vegetarian Options"],
    color: "from-yellow-500/10 to-yellow-600/5",
    iconBg: "#B5770D",
  },
  {
    icon: <Shield size={28} />,
    title: "24/7 Security",
    beds: 0,
    description:
      "Feel completely safe with round-the-clock security guards, CCTV surveillance, and bio-metric entry systems at all access points.",
    features: ["CCTV Cameras", "Bio-metric Access", "Security Guards", "Visitor Log"],
    color: "from-red-500/10 to-red-600/5",
    iconBg: "#C0392B",
  },
  {
    icon: <Sparkles size={28} />,
    title: "House Cleaning",
    beds: 0,
    description:
      "Our dedicated housekeeping team ensures your room and all common areas are cleaned daily, maintaining the highest standards of hygiene.",
    features: ["Daily Cleaning", "Common Areas", "Hygienic Standards", "Fresh Linen"],
    color: "from-purple-500/10 to-purple-600/5",
    iconBg: "#6B35A8",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function RoomTypes() {
  return (
    <section className="section-padding bg-[#FFF8F5]">
      <div className="container-custom">
        <SectionTitle
          eyebrow="Our Offerings"
          title="Rooms & "
          highlight="Services"
          description="Choose the accommodation that best suits your needs and budget. All rooms include our premium amenities and services."
          centered
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {rooms.map((room) => (
            <motion.div
              key={room.title}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(232, 96, 28, 0.15)" }}
              className={`relative bg-white rounded-2xl p-6 border border-gray-100 cursor-default group transition-all duration-300`}
            >
              {room.popular && (
                <div className="absolute -top-3 left-6 bg-[#E8601C] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div
                className="icon-ring mb-5 group-hover:!bg-gradient-to-br group-hover:from-[#E8601C] group-hover:to-[#F4845F]"
              >
                <span
                  className="text-[#E8601C] group-hover:text-white transition-colors"
                  style={{ display: "flex" }}
                >
                  {room.icon}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-[#1A2E5A] mb-2">
                {room.title}
              </h3>
              {room.beds > 0 && (
                <span className="inline-block text-xs font-semibold text-[#E8601C] bg-[#E8601C]/10 px-2 py-0.5 rounded-full mb-3">
                  {room.beds} Beds
                </span>
              )}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {room.description}
              </p>

              <ul className="space-y-2">
                {room.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8601C] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <a
            href="tel:+917816055655"
            className="btn-primary inline-flex"
          >
            Inquire About Availability
          </a>
        </div>
      </div>
    </section>
  );
}
