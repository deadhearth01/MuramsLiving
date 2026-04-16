"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Wind,
  Wifi,
  UtensilsCrossed,
  Shield,
  Star,
  CheckCircle2,
  ArrowRight,
  Building2,
  Sparkles,
  Layers,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const features = [
  {
    icon: Car,
    title: "Dedicated Parking",
    description:
      "Secure on-premises parking for two-wheelers and four-wheelers — a rarity in Rushikonda.",
  },
  {
    icon: Wind,
    title: "AC Rooms Available",
    description:
      "Beat Vizag's summer heat with our fully air-conditioned room options, available at affordable rates.",
  },
  {
    icon: Sparkles,
    title: "Modern Interiors",
    description:
      "Thoughtfully designed rooms with premium furniture, ample storage, and a clean contemporary feel.",
  },
  {
    icon: Wifi,
    title: "Free Wifi",
    description:
      "Dedicated fibre broadband connection ensuring consistent speeds across the entire building.",
  },
  {
    icon: UtensilsCrossed,
    title: "3 Meals a Day",
    description:
      "Freshly prepared breakfast, lunch, and dinner included in your monthly rent. No food worries.",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description:
      "CCTV surveillance and on-site security round the clock for complete peace of mind.",
  },
];

const defaultRoomTypes = [
  {
    type: "2-Sharing Room",
    price: "Starting ₹9,000/mo",
    sharing: "2",
    highlights: [
      "Semi-private room",
      "Furnished with study table & chair",
      "Wardrobe & personal storage",
      "Attached bathroom",
      "All meals included",
    ],
    featured: true,
  },
  {
    type: "3-Sharing Room",
    price: "Starting ₹7,500/mo",
    sharing: "3",
    highlights: [
      "Spacious shared room",
      "Study table & chair",
      "Wardrobe",
      "Attached/shared bathroom",
      "All meals included",
    ],
  },
  {
    type: "4-Sharing Room",
    price: "Starting ₹6,500/mo",
    sharing: "4",
    highlights: [
      "Budget-friendly option",
      "Study table & chair",
      "Wardrobe",
      "Shared bathroom",
      "All meals included",
    ],
  },
];

const included = [
  "Furnished room with study table",
  "3 meals a day (breakfast, lunch, dinner)",
  "Free Wifi",
  "Daily housekeeping",
  "24/7 hot water",
  "Laundry facility access",
  "Power backup",
  "CCTV & on-site security",
  "Parking (two-wheeler & four-wheeler)",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function SilverPageClient() {
  const [roomTypes, setRoomTypes] = useState(defaultRoomTypes);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("pricing_config")
          .select("item_name, amount")
          .eq("category", "student")
          .eq("building", "silver")
          .eq("is_visible", true)
          .order("display_order");
        if (data && data.length > 0) {
          const priceMap: Record<string, number> = {};
          data.forEach((d) => { priceMap[d.item_name] = d.amount; });
          setRoomTypes((prev) =>
            prev.map((room) => ({
              ...room,
              price: priceMap[room.type]
                ? `Starting ₹${Number(priceMap[room.type]).toLocaleString("en-IN")}/mo`
                : room.price,
            }))
          );
        }
      } catch { /* fallback to defaults */ }
    })();
  }, []);

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
        {/* Silver accent gradient */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-slate-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container-custom relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-slate-400/20 text-slate-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              <Building2 size={15} className="text-slate-300" /> Silver Building
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Premium Living at
              <br />
              <span className="text-slate-300">Silver</span> Building
            </h1>
            <p className="text-white/65 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Our Silver Building offers everything you expect from a premium PG
              — modern rooms, dedicated parking, AC options, and all meals — in
              the heart of Rushikonda, Vizag.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book?building=silver"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-300 text-navy-dark font-semibold rounded-full hover:bg-white transition-all shadow-lg"
              >
                Book Silver Room <ArrowRight size={18} />
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
      <section className="bg-slate-700">
        <div className="container-custom py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
            {[
              { value: "Parking", label: "2-wheeler & 4-wheeler" },
              { value: "AC + Non-AC", label: "Room Options" },
              { value: "4.6★", label: "Google Rating" },
              { value: "All meals", label: "Included" },
            ].map((s) => (
              <div key={s.label} className="py-2">
                <p className="text-xl md:text-2xl font-bold font-heading">
                  {s.value}
                </p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              Silver Building Highlights
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark">
              Premium Features,
              <br />
              Practical Value
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-slate-600" />
                </div>
                <h3 className="font-heading font-bold text-lg text-navy-dark mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Room types */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              Bed Sharing Options
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark">
              Choose Your
              <br />
              Room
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roomTypes.map((room, i) => (
              <motion.div
                key={room.type}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className={`rounded-2xl p-7 border-2 ${room.featured ? "border-slate-400 bg-slate-50 shadow-lg" : "border-gray-200 bg-white"}`}
              >
                {room.featured && (
                  <div className="inline-flex items-center gap-1.5 bg-slate-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    <Star size={11} className="fill-white" /> Popular Choice
                  </div>
                )}
                <h3 className="font-heading font-bold text-xl text-navy-dark mb-1">
                  {room.type}
                </h3>
                <p className="text-slate-600 font-semibold text-lg mb-5">
                  {room.price}
                </p>
                <ul className="space-y-2.5 mb-6">
                  {room.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-2.5 text-sm text-gray-700"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-slate-500 flex-shrink-0"
                      />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/book?building=silver&sharing=${room.sharing}`}
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    room.featured
                      ? "bg-slate-700 text-white hover:bg-slate-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Book This Room
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Included split */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-500 font-semibold text-sm uppercase tracking-[0.15em] mb-3">
                All-Inclusive
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark mb-6">
                Everything You Need
                <br />
                Under One Roof
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Silver Building residents enjoy the same full suite of Murams
                Living amenities — all bundled into one transparent monthly
                rate.
              </p>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-slate-500 flex-shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/book?building=silver"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-800 transition-all"
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
              <div className="grid grid-cols-2 gap-4">
                {[
                  "/clicks/IMG_0390.jpg",
                  "/clicks/IMG_0391.jpg",
                  "/clicks/IMG_0392.jpg",
                  "/clicks/IMG_0393.jpg",
                ].map((src, i) => (
                  <div
                    key={src}
                    className={`relative rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
                  >
                    <Image
                      src={src}
                      alt={`Silver Building room ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Compare buildings */}
      <section className="py-20 md:py-28">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              Gold vs Silver
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy-dark">
              Which Building
              <br />
              Is Right for You?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <Layers size={16} className="text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">
                  Gold Building
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Budget-friendly starting price",
                  "Cozy, efficient room layouts",
                  "Same meals & WiFi & security",
                  "Great for students on a budget",
                  "Popular among long-term residents",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <CheckCircle2
                      size={15}
                      className="text-yellow-500 flex-shrink-0"
                    />{" "}
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/book?building=gold"
                className="block mt-5 w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-yellow-400 text-white hover:bg-yellow-500 transition-all"
              >
                Book Gold Room
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-slate-400 bg-slate-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-500 rounded-xl flex items-center justify-center">
                  <Layers size={16} className="text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">
                  Silver Building
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Dedicated parking available",
                  "AC room option available",
                  "Modern interiors & more space",
                  "Great for professionals & families",
                  "Slightly higher — better value",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <CheckCircle2
                      size={15}
                      className="text-slate-500 flex-shrink-0"
                    />{" "}
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/book?building=silver"
                className="block mt-5 w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-slate-600 text-white hover:bg-slate-700 transition-all"
              >
                Book Silver Room
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-800">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <p className="text-slate-300 font-semibold text-sm uppercase tracking-[0.15em] mb-4">
            Silver Building
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-5">
            Experience Premium PG
            <br />
            Living in Rushikonda
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Limited rooms available in our Silver Building. Reach out to check
            availability or schedule a visit today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book?building=silver"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-300 text-slate-900 font-semibold rounded-full hover:bg-white transition-all shadow-lg"
            >
              Book a Silver Room <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/917816055655?text=Hi%2C%20I%20am%20interested%20in%20the%20Silver%20Building%20at%20Murams%20Living."
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
