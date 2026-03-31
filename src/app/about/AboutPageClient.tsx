"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Shield,
  Users,
  Star,
  CheckCircle,
  MapPin,
  Phone,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

const values = [
  {
    icon: <Heart size={28} />,
    title: "Comfort First",
    description:
      "We prioritize your comfort above all else, ensuring every aspect of your stay exceeds expectations.",
  },
  {
    icon: <Shield size={28} />,
    title: "Safety Always",
    description:
      "24/7 security, CCTV surveillance, and biometric access ensure you feel completely safe at all times.",
  },
  {
    icon: <Users size={28} />,
    title: "Community Living",
    description:
      "We foster a vibrant community where residents connect, grow, and support each other.",
  },
  {
    icon: <Star size={28} />,
    title: "Premium Quality",
    description:
      "From marble flooring to high-speed WiFi, we offer premium amenities at affordable prices.",
  },
];

const milestones = [
  { year: "2020", event: "Murams Living founded in Rushikonda" },
  { year: "2021", event: "First batch of residents welcomed" },
  { year: "2022", event: "Expanded to 3 room types; 200+ residents served" },
  { year: "2023", event: "Added A/C rooms, upgraded dining facilities" },
  { year: "2024", event: "500+ happy residents milestone achieved" },
  { year: "2025+", event: "Continuing to grow and serve Visakhapatnam" },
];

const team = [
  {
    name: "Mr. Murali Krishna",
    role: "Founder & Director",
    description: "With a vision for premium affordable living, Murali founded Murams Living to serve students and working professionals in Vizag.",
    initials: "MK",
    color: "from-[#E8601C] to-[#F4845F]",
  },
  {
    name: "Mrs. Padma Rao",
    role: "Operations Manager",
    description: "Padma ensures smooth day-to-day operations, maintaining the highest standards of cleanliness and resident satisfaction.",
    initials: "PR",
    color: "from-[#1A2E5A] to-[#2A4A8A]",
  },
  {
    name: "Mr. Ravi Kumar",
    role: "Facility Manager",
    description: "Ravi oversees all maintenance and facility management, ensuring every amenity functions perfectly round the clock.",
    initials: "RK",
    color: "from-[#2A6049] to-[#4CAF82]",
  },
];

export default function AboutPageClient() {
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
            Our Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4"
          >
            About{" "}
            <span className="gradient-text">Murams Living</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Building a home away from home for students and working professionals
            in the beautiful coastal city of Visakhapatnam.
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div
                className="rounded-2xl overflow-hidden h-96"
                style={{
                  background:
                    "linear-gradient(135deg, #1A2E5A 0%, #E8601C 100%)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="font-heading text-7xl font-bold opacity-20">
                      ML
                    </div>
                    <p className="text-white/60 text-sm mt-2">
                      Murams Living — Est. 2020
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 bg-[#E8601C] text-white p-4 rounded-xl shadow-lg">
                <div className="font-heading font-bold text-2xl">500+</div>
                <div className="text-xs opacity-90">Happy Residents</div>
              </div>
            </motion.div>

            <div>
              <SectionTitle
                eyebrow="Our Story"
                title="How It All "
                highlight="Began"
                description=""
              />
              <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
                <p>
                  Murams Living was born from a simple yet powerful vision: to
                  provide students and working professionals in Visakhapatnam
                  with a living experience that truly feels like home. Founded
                  in 2020, we set out to create a space where comfort, safety,
                  and community converge.
                </p>
                <p>
                  Located in the scenic Rushikonda area — just 1 km from the
                  famous Rushikonda Beach — our PG & hostel offers the perfect
                  blend of serene surroundings and urban convenience. With easy
                  access to IT parks, educational institutions, and city
                  amenities, we are ideally situated for today&apos;s dynamic
                  residents.
                </p>
                <p>
                  Our new, fully-furnished building features marble flooring,
                  A/C and Non-A/C rooms, a dedicated dining area serving
                  home-cooked meals, high-speed WiFi, and a stunning beach-view
                  terrace — all maintained with the highest standards of
                  cleanliness and security.
                </p>
                <p>
                  In just a few years, we&apos;ve had the privilege of serving
                  over 500 residents, each of whom has become part of the
                  Murams Living family.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-[#E8601C]" />
                  Rushikonda, Visakhapatnam
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} className="text-[#E8601C]" />
                  +91 7816055655
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-[#FFF8F5]">
        <div className="container-custom">
          <SectionTitle
            eyebrow="Our Values"
            title="What We "
            highlight="Stand For"
            description="Our core values guide everything we do — from how we build our spaces to how we serve our residents."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm card-hover"
              >
                <div className="icon-ring mx-auto mb-4">
                  <span className="text-[#E8601C]">{value.icon}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A2E5A] mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            eyebrow="Our Journey"
            title="Milestones & "
            highlight="Growth"
            description="From humble beginnings to a thriving community — here's how Murams Living has grown over the years."
            centered
          />
          <div className="max-w-2xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#E8601C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[#E8601C]/20 mt-2" />
                  )}
                </div>
                <div className="pb-8 last:pb-0">
                  <span className="text-xs font-bold text-[#E8601C] uppercase tracking-wider">
                    {milestone.year}
                  </span>
                  <p className="text-[#1A2E5A] font-medium mt-1">
                    {milestone.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-[#FFF8F5]">
        <div className="container-custom">
          <SectionTitle
            eyebrow="Our Team"
            title="The People Behind "
            highlight="Murams Living"
            description="Our dedicated team works tirelessly to ensure your stay is comfortable, safe, and memorable."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${member.color} flex items-center justify-center`}
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="font-heading font-bold text-2xl text-white">
                      {member.initials}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg text-[#1A2E5A]">
                    {member.name}
                  </h3>
                  <span className="text-[#E8601C] text-xs font-semibold">
                    {member.role}
                  </span>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 md:py-20"
        style={{
          background: "linear-gradient(135deg, #E8601C 0%, #C44E0E 100%)",
        }}
      >
        <div className="container-custom text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading font-bold text-3xl md:text-4xl text-white mb-4"
          >
            Ready to Join Our Community?
          </motion.h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto">
            Experience the Murams Living difference. Contact us today to check
            room availability and book your stay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+917816055655"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#E8601C] font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1"
            >
              <Phone size={18} />
              Call Us Now
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
