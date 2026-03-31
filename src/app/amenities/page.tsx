import type { Metadata } from "next";
import {
  Moon, Archive, Wind, Tv, Sun, UtensilsCrossed, WashingMachine,
  Sunset, ShirtIcon, Wifi, ShieldCheck, MoveUp, ParkingCircle,
  Droplets, Sparkles, Camera, Smartphone, Coffee,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Amenities",
  description:
    "Explore the premium amenities at Murams Living — A/C rooms, high-speed WiFi, home-cooked meals, 24/7 security, beach view terrace, and much more.",
};

const amenityCategories = [
  {
    category: "Comfort & Living",
    color: "from-blue-500 to-blue-600",
    items: [
      { icon: <Moon size={24} />, title: "Premium Mattresses", desc: "Innerspring mattresses for a restful night's sleep" },
      { icon: <Archive size={24} />, title: "Individual Cupboards", desc: "Personal lockable storage for each resident" },
      { icon: <Wind size={24} />, title: "Air Conditioning", desc: "A/C & Non-A/C room options available" },
      { icon: <Sparkles size={24} />, title: "Daily Housekeeping", desc: "Rooms and common areas cleaned every day" },
    ],
  },
  {
    category: "Food & Dining",
    color: "from-orange-500 to-red-500",
    items: [
      { icon: <UtensilsCrossed size={24} />, title: "Dining Room", desc: "Dedicated dining space with fresh home-cooked meals" },
      { icon: <Coffee size={24} />, title: "3 Meals Daily", desc: "Breakfast, lunch, and dinner served on schedule" },
    ],
  },
  {
    category: "Utilities & Services",
    color: "from-green-500 to-emerald-600",
    items: [
      { icon: <Wifi size={24} />, title: "High Speed WiFi", desc: "Blazing-fast broadband throughout the building" },
      { icon: <Tv size={24} />, title: "TV Entertainment", desc: "Cable TV in common rooms for leisure" },
      { icon: <Sun size={24} />, title: "Solar Water Heating", desc: "Eco-friendly 24-hr hot water system" },
      { icon: <Droplets size={24} />, title: "24-hr Hot Water", desc: "Continuous hot water supply round the clock" },
      { icon: <WashingMachine size={24} />, title: "Washing Machine", desc: "On-site laundry machine available for residents" },
      { icon: <ShirtIcon size={24} />, title: "Dhobi / Laundry", desc: "Professional laundry & ironing service (fee applies)" },
    ],
  },
  {
    category: "Safety & Security",
    color: "from-red-500 to-pink-600",
    items: [
      { icon: <ShieldCheck size={24} />, title: "24/7 Security Guard", desc: "Trained guards on duty at all times" },
      { icon: <Camera size={24} />, title: "CCTV Surveillance", desc: "Cameras installed across all common areas" },
      { icon: <Smartphone size={24} />, title: "Biometric Access", desc: "Thumbprint reader for secure entry & exit" },
    ],
  },
  {
    category: "Infrastructure",
    color: "from-purple-500 to-indigo-600",
    items: [
      { icon: <MoveUp size={24} />, title: "Elevator / Lift", desc: "Modern lift for easy floor access" },
      { icon: <ParkingCircle size={24} />, title: "Covered Parking", desc: "Secure covered bike parking area" },
      { icon: <Sunset size={24} />, title: "Beach View Terrace", desc: "Rooftop sit-out with stunning ocean views" },
    ],
  },
];

export default function AmenitiesPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 60%, #2A1A0E 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #E8601C 0%, transparent 50%)" }}
        />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-full bg-[#E8601C]/20 text-[#F4845F]">
            Premium Facilities
          </span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            World-Class{" "}
            <span className="bg-gradient-to-r from-[#E8601C] to-[#F4845F] bg-clip-text text-transparent">
              Amenities
            </span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Every amenity at Murams Living is carefully selected to ensure you have the most
            comfortable, convenient, and enjoyable stay.
          </p>
        </div>
      </section>

      {/* Amenities by Category */}
      {amenityCategories.map((cat, catIndex) => (
        <section
          key={cat.category}
          className={`section-padding ${catIndex % 2 === 0 ? "bg-white" : "bg-[#FFF8F5]"}`}
        >
          <div className="container-custom">
            <SectionTitle
              eyebrow="Amenities"
              title={cat.category}
              highlight=""
              centered
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cat.items.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-white">{item.icon}</span>
                  </div>
                  <h3 className="font-heading font-bold text-[#1A2E5A] text-base mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #E8601C 0%, #C44E0E 100%)" }}
      >
        <div className="container-custom text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Experience All These Amenities
          </h2>
          <p className="text-white/90 text-base mb-8 max-w-xl mx-auto">
            Book your stay at Murams Living and enjoy premium facilities at an affordable price.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+917816055655"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#E8601C] font-bold px-8 py-4 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              Call to Book Now
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-[#E8601C] hover:-translate-y-1 transition-all duration-300"
            >
              Send Enquiry
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
