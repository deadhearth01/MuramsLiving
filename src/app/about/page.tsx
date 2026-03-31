import type { Metadata } from "next";
import { CheckCircle, Users, Building2, Heart, Shield } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Murams Living — a premium PG and hostel in Rushikonda, Visakhapatnam offering comfort, safety, and a true home-like experience.",
};

const values = [
  {
    icon: <Heart size={28} />,
    title: "Home-like Comfort",
    description:
      "We believe every resident deserves to feel at home. From cozy rooms to warm meals, every detail is crafted with care.",
  },
  {
    icon: <Shield size={28} />,
    title: "Safety First",
    description:
      "Round-the-clock CCTV surveillance, biometric access, and trained security personnel keep you safe at all times.",
  },
  {
    icon: <Users size={28} />,
    title: "Community Living",
    description:
      "Foster meaningful connections with like-minded residents. Our common spaces are designed to build a strong community.",
  },
  {
    icon: <Building2 size={28} />,
    title: "Premium Infrastructure",
    description:
      "Modern architecture with marble flooring, elevators, and thoughtfully designed spaces make Murams Living stand out.",
  },
];

const timeline = [
  { year: "2020", title: "Founded", desc: "Murams Living was established with a vision to provide quality accommodation to students and professionals in Visakhapatnam." },
  { year: "2021", title: "Expansion", desc: "Added more room types and upgraded amenities based on resident feedback. Introduced 24/7 hot water and solar heating." },
  { year: "2022", title: "Community Growth", desc: "Crossed 200+ happy residents. Launched our dining facility with hygienic home-cooked meals three times a day." },
  { year: "2023", title: "Recognition", desc: "Received top ratings on multiple platforms for cleanliness, safety, and management. Upgraded security infrastructure." },
  { year: "2024+", title: "Future Plans", desc: "Continuing to enhance resident experience with better facilities, faster internet, and expanded amenities." },
];

const team = [
  { name: "Murams Management", role: "Founders & Management Team", initials: "MM" },
  { name: "Security Team", role: "24/7 Safety & Surveillance", initials: "ST" },
  { name: "Housekeeping Team", role: "Cleanliness & Maintenance", initials: "HK" },
  { name: "Kitchen Team", role: "Nutrition & Food Service", initials: "KT" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-24 md:py-32 flex items-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 60%, #2A1A0E 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #E8601C 0%, transparent 50%), radial-gradient(circle at 80% 50%, #F4845F 0%, transparent 50%)`
          }}
        />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-full bg-[#E8601C]/20 text-[#F4845F]">
            Our Story
          </span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-[#E8601C] to-[#F4845F] bg-clip-text text-transparent">
              Murams Living
            </span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            We started with a simple belief: everyone deserves a safe, comfortable, and
            home-like place to stay while pursuing their dreams in Visakhapatnam.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionTitle
                eyebrow="Who We Are"
                title="More Than Just a "
                highlight="PG / Hostel"
                description="Murams Living is a premium paying guest accommodation located in the scenic coastal area of Rushikonda, Visakhapatnam. We offer a unique blend of modern amenities, home-cooked meals, and a safe community environment."
              />
              <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                Whether you're a student at Geetham Medical College, a professional working at the IT SEZ,
                or someone who simply wants to experience the beauty of Rushikonda — Murams Living is
                your perfect home away from home.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
                We pride ourselves on our attention to detail, from the marble flooring and well-designed
                rooms to the nutritious meals and round-the-clock security. Every element of Murams Living
                has been thoughtfully curated to give you the best possible stay.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "500+", label: "Happy Residents" },
                  { value: "3+", label: "Room Options" },
                  { value: "10+", label: "Amenities" },
                  { value: "24/7", label: "Support" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#FFF8F5] rounded-xl p-4 text-center">
                    <div className="font-heading font-bold text-3xl text-[#E8601C]">{stat.value}</div>
                    <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #1A2E5A 0%, #E8601C 100%)",
                  height: "420px",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="font-heading text-8xl font-bold opacity-10">ML</div>
                    <p className="text-white/50 text-sm mt-2">Murams Living, Rushikonda</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 bg-[#E8601C] text-white rounded-xl px-5 py-3 shadow-lg">
                <div className="font-heading font-bold text-2xl">4.8 ★</div>
                <div className="text-xs opacity-90">Avg Resident Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[#FFF8F5]">
        <div className="container-custom">
          <SectionTitle
            eyebrow="Our Values"
            title="What We "
            highlight="Stand For"
            description="Our core values guide everything we do at Murams Living."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="icon-ring mb-4 group-hover:bg-gradient-to-br group-hover:from-[#E8601C] group-hover:to-[#F4845F]">
                  <span className="text-[#E8601C] group-hover:text-white transition-colors">
                    {value.icon}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A2E5A] mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <SectionTitle
            eyebrow="Our Journey"
            title="Growing "
            highlight="Together"
            description="From humble beginnings to becoming one of Rushikonda's most trusted PG accommodations."
            centered
          />
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E8601C] to-[#1A2E5A] -translate-x-1/2" />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex gap-6 md:gap-0 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-[#E8601C] border-2 border-white shadow -translate-x-1/2 top-3 z-10" />

                  {/* Content */}
                  <div className={`pl-14 md:pl-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-10" : "md:pl-10"}`}>
                    <div className="bg-[#FFF8F5] rounded-xl p-5 border border-gray-100">
                      <span className="inline-block text-xs font-bold text-[#E8601C] bg-[#E8601C]/10 px-2.5 py-1 rounded-full mb-2">
                        {item.year}
                      </span>
                      <h3 className="font-heading font-bold text-[#1A2E5A] text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  {/* Spacer for opposite side */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-[#FFF8F5]">
        <div className="container-custom">
          <SectionTitle
            eyebrow="Our Team"
            title="The People Behind "
            highlight="Murams Living"
            description="Our dedicated team works tirelessly to make your stay comfortable, safe, and memorable."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E8601C] to-[#F4845F] flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-heading font-bold text-xl">{member.initials}</span>
                </div>
                <h3 className="font-heading font-bold text-[#1A2E5A] text-base mb-1">{member.name}</h3>
                <p className="text-gray-500 text-xs">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #1A2E5A 0%, #0F1C38 100%)" }}
      >
        <div className="container-custom text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Ready to Experience{" "}
            <span className="bg-gradient-to-r from-[#E8601C] to-[#F4845F] bg-clip-text text-transparent">
              Murams Living?
            </span>
          </h2>
          <p className="text-white/70 text-base mb-8 max-w-xl mx-auto">
            Book a visit today or call us to learn more about availability and pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+917816055655" className="btn-primary">
              Call +91 7816055655
            </a>
            <a href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-[#1A2E5A]">
              Send an Enquiry
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
