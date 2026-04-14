"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Wifi,
  UtensilsCrossed,
  Shield,
  BookOpen,
  Bus,
  Star,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Wind,
} from "lucide-react";

const perks = [
  {
    icon: Wifi,
    title: "Free Wifi",
    description:
      "Dedicated fibre broadband with consistent speeds for streaming, video calls, and research.",
  },
  {
    icon: UtensilsCrossed,
    title: "Home-Cooked Meals",
    description:
      "3 nutritious meals a day — breakfast, lunch, and dinner — so you can stay focused on studies.",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description:
      "CCTV coverage, biometric entry, and on-site security give parents and students peace of mind.",
  },
  {
    icon: BookOpen,
    title: "Study-Friendly Rooms",
    description:
      "Well-lit rooms with study tables, proper ventilation, and a quiet environment for deep work.",
  },
  {
    icon: Bus,
    title: "College Proximity",
    description:
      "Minutes from GITAM University, GIMSR Medical College, and other institutions in Rushikonda.",
  },
  {
    icon: Wind,
    title: "AC & Non-AC Options",
    description:
      "Choose the room type that fits your budget — both come with the same premium amenities.",
  },
];

const colleges = [
  {
    name: "GITAM University",
    distance: "5 min",
    img: "/prime-location/it-sez.jpeg",
  },
  {
    name: "GIMSR Medical College",
    distance: "8 min",
    img: "/prime-location/GIMSR Medical College.jpeg",
  },
  {
    name: "Rushikonda Beach",
    distance: "3 min",
    img: "/prime-location/Rushikonda Beach.jpeg",
  },
  {
    name: "Vizag Railway Station",
    distance: "30 min",
    img: "/prime-location/Visakhapatnam Railway Station.jpeg",
  },
];

const included = [
  "3 meals a day (breakfast, lunch, dinner)",
  "Free Wifi included",
  "Daily housekeeping",
  "24/7 hot water",
  "Laundry facility",
  "24/7 security & CCTV",
  "Power backup",
  "Common recreation area",
];

const testimonials = [
  {
    name: "Priya S.",
    course: "B.Tech, GITAM University",
    text: "Murams Living felt like home from day one. The meals are amazing and I never had to worry about anything — just focused on my studies.",
    rating: 5,
  },
  {
    name: "Arjun K.",
    course: "MBBS, GIMSR",
    text: "As a medical student, I needed a quiet and clean place. The rooms are well-maintained and the WiFi never lets me down during late-night prep.",
    rating: 5,
  },
  {
    name: "Sneha M.",
    course: "MBA, Andhra University",
    text: "The security and location are unmatched. My parents were relieved the moment they saw the place. Highly recommend to all outstation students!",
    rating: 5,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function StudentsPageClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-navy-dark overflow-hidden py-20 md:py-32">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container-custom relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              For Students
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Your Perfect
              <br />
              <span className="text-primary">Study Home</span> in Vizag
            </h1>
            <p className="text-white/65 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Murams Living is built for students who want comfort, safety, and
              a distraction-free environment — right in the heart of Rushikonda,
              near all the top colleges.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/30"
              >
                Book a Room <ArrowRight size={18} />
              </Link>
              <a
                href="tel:+917816055655"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-primary">
        <div className="container-custom py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
            {[
              { value: "1000+", label: "Students Hosted" },
              { value: "4.6★", label: "Google Rating" },
              { value: "10+", label: "Years Est. 2015" },
              { value: "3 min", label: "To Rushikonda Beach" },
            ].map((s) => (
              <div key={s.label} className="py-2">
                <p className="text-2xl md:text-3xl font-bold font-heading">
                  {s.value}
                </p>
                <p className="text-white/75 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              Why Students Love It
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark">
              Everything You Need,
              <br />
              Nothing You Don&apos;t
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <perk.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-navy-dark mb-2">
                  {perk.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {perk.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
                All-Inclusive Stay
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark mb-6">
                Everything Included
                <br />
                in One Flat Rent
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                No hidden charges, no extra bills. Your monthly rent covers
                everything you need for a comfortable and productive stay.
              </p>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-primary flex-shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 bg-navy-dark text-white font-semibold rounded-full hover:bg-navy transition-all"
              >
                Check Availability <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <Image
                  src="/clicks/IMG_0383.jpg"
                  alt="Student room at Murams Living"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Star size={18} className="text-primary fill-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-navy-dark text-sm">
                        4.6 Google Rating
                      </p>
                      <p className="text-xs text-gray-500">
                        Loved by 1000+ students
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nearby Colleges */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              Prime Location
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark">
              Close to Everything
              <br />
              That Matters
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {colleges.map((c, i) => (
              <motion.div
                key={c.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="relative h-40">
                  <Image
                    src={c.img}
                    alt={c.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-sm">
                    {c.name}
                  </p>
                  <p className="text-primary text-xs font-medium mt-1 flex items-center gap-1">
                    <MapPin size={11} /> {c.distance} away
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              Student Stories
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark">
              Hear From
              <br />
              Our Residents
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="text-primary fill-primary"
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.course}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-dark">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
            Limited Rooms Available
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-5">
            Ready to Make Murams
            <br />
            Your Study Home?
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Join over 1000 students who chose Murams Living for their PG stay in
            Visakhapatnam. Book a room today or schedule a visit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/30"
            >
              Book a Room <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/917816055655?text=Hi%2C%20I%20am%20a%20student%20interested%20in%20a%20room%20at%20Murams%20Living."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/25 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
