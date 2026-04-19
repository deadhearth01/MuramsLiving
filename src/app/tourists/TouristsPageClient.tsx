"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Waves,
  UtensilsCrossed,
  Shield,
  Car,
  MapPin,
  Star,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";

const highlights = [
  {
    icon: Waves,
    title: "Beach at Your Doorstep",
    description:
      "Rushikonda Beach — one of Vizag's cleanest blue-flag beaches — is just a 3-minute walk away.",
  },
  {
    icon: UtensilsCrossed,
    title: "All Meals Included",
    description:
      "Home-style breakfast, lunch, and dinner every day. Eat well without hunting for restaurants.",
  },
  {
    icon: Shield,
    title: "Safe & Secure Stay",
    description:
      "24/7 CCTV, on-site security, and biometric access for a worry-free visit.",
  },
  {
    icon: Car,
    title: "Easy Access",
    description:
      "15 minutes from Vizag Airport, 30 minutes from Railway Station. Cabs and autos available at the gate.",
  },
  {
    icon: Calendar,
    title: "Flexible Short Stays",
    description:
      "Whether you're staying a week or a month, we welcome short-term guests with open arms.",
  },
  {
    icon: Clock,
    title: "No Long Commitment",
    description:
      "No long-term lock-ins. Stay for as long as you need and leave when you're ready.",
  },
];

const attractions = [
  {
    name: "Rushikonda Beach",
    distance: "3 min walk",
    img: "/prime-location/Rushikonda Beach.jpeg",
  },
  {
    name: "Vizag Zoo",
    distance: "15 min drive",
    img: "/prime-location/zoo.jpeg",
  },
  {
    name: "Stadium",
    distance: "20 min drive",
    img: "/prime-location/stadium.jpeg",
  },
  {
    name: "Vizag Airport",
    distance: "15 min drive",
    img: "/prime-location/airport-vizag.png",
  },
  {
    name: "Visakhapatnam Railway Station",
    distance: "30 min drive",
    img: "/prime-location/Visakhapatnam Railway Station.jpeg",
  },
  {
    name: "IT SEZ / Tech Corridor",
    distance: "10 min drive",
    img: "/prime-location/it-sez.jpeg",
  },
];

const included = [
  "Comfortable furnished room",
  "3 meals daily (breakfast, lunch, dinner)",
  "Free Wifi",
  "Daily housekeeping",
  "24/7 hot water",
  "24/7 security & CCTV",
  "Power backup",
  "Easy check-in process",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function TouristsPageClient() {
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
              For Guests
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Stay by the
              <br />
              <span className="text-primary">Beach</span> in Visakhapatnam
            </h1>
            <p className="text-white/65 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Murams Living offers comfortable short-stay rooms in Rushikonda —
              Vizag&apos;s most scenic beachside neighbourhood. Meals included,
              no hassle, great location.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/30"
              >
                Book Your Stay <ArrowRight size={18} />
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
              { value: "3 min", label: "To Rushikonda Beach" },
              { value: "4.6★", label: "Google Rating" },
              { value: "15 min", label: "From Airport" },
              { value: "All meals", label: "Included" },
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

      {/* Why choose */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              Why Murams Living
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark">
              The Smart Way
              <br />
              to Stay in Vizag
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <h.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-navy-dark mb-2">
                  {h.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {h.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included split */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-square">
                <Image
                  src="/clicks/IMG_0384.jpg"
                  alt="Room at Murams Living"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                  <p className="font-bold text-navy-dark text-sm flex items-center gap-2">
                    <Waves size={16} className="text-primary" /> 3 min to Beach
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
                Included in Your Stay
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark mb-6">
                One Rate,
                <br />
                Everything Covered
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                No hotel-style extras or surprise charges. One flat
                daily/monthly rate covers your room, all meals, and every
                utility.
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
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              Explore Vizag
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark">
              Top Attractions
              <br />
              Near Us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {attractions.map((a, i) => (
              <motion.div
                key={a.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={a.img}
                    alt={a.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900">{a.name}</p>
                  <p className="text-primary text-sm font-medium mt-1 flex items-center gap-1">
                    <MapPin size={13} /> {a.distance}
                  </p>
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
            Plan Your Visit
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-5">
            Your Beachside Home
            <br />
            Awaits in Vizag
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Whether you&apos;re exploring Vizag for a week or staying for a
            month, Murams Living makes it easy, comfortable, and affordable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/30"
            >
              Book a Room <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/917816055655?text=Hi%2C%20I%20am%20planning%20to%20visit%20Vizag%20and%20interested%20in%20a%20short%20stay%20at%20Murams%20Living."
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
