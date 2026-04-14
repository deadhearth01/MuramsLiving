"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { MapPin, ExternalLink, Navigation, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Location {
  title: string;
  distance: string;
  time: string;
  description: string;
  image: string;
  fallbackGradient: string;
}

const locations: Location[] = [
  {
    title: "Rushikonda Beach",
    distance: "1 km",
    time: "5 min walk",
    description:
      "Beautiful golden sandy beach perfect for morning walks and evening relaxation. One of Vizag's most loved beaches, just steps from your door.",
    image: "/prime-location/Rushikonda Beach.jpeg",
    fallbackGradient: "from-sky-400 via-blue-500 to-indigo-600",
  },
  {
    title: "Gitam Medical College",
    distance: "0.5 km",
    time: "3 min walk",
    description:
      "Prestigious medical college and hospital within walking distance. Perfect for medical students and healthcare professionals.",
    image: "/prime-location/GIMSR Medical College.jpeg",
    fallbackGradient: "from-emerald-400 via-green-500 to-teal-600",
  },
  {
    title: "IT SEZ / Tech Park",
    distance: "4 km",
    time: "10 min drive",
    description:
      "Major IT hub with top technology companies like Wipro, TCS, and Infosys. Short commute for working professionals.",
    image: "/prime-location/it-sez.jpeg",
    fallbackGradient: "from-violet-400 via-purple-500 to-indigo-600",
  },
  {
    title: "Food & Restaurants",
    distance: "0.8 km",
    time: "5 min walk",
    description:
      "Various restaurants, cafes, street food stalls, and food courts nearby offering cuisines from all over India.",
    image: "/prime-location/restaurent.jpg",
    fallbackGradient: "from-orange-400 via-red-500 to-rose-600",
  },
  {
    title: "Railway Station",
    distance: "15 km",
    time: "25 min drive",
    description:
      "Major railway junction connecting all major cities across India. Well-connected via city buses and autos.",
    image: "/prime-location/Visakhapatnam Railway Station.jpeg",
    fallbackGradient: "from-slate-500 via-gray-600 to-zinc-700",
  },
  {
    title: "Visakhapatnam Airport",
    distance: "22 km",
    time: "35 min drive",
    description:
      "International airport with domestic and international flights connecting Vizag to major cities worldwide.",
    image: "/prime-location/airport-vizag.png",
    fallbackGradient: "from-blue-400 via-sky-500 to-cyan-600",
  },
  {
    title: "VUDA Stadium",
    distance: "6 km",
    time: "12 min drive",
    description:
      "Major sports complex and stadium hosting local and state-level sporting events. Great for sports enthusiasts.",
    image: "/prime-location/stadium.jpeg",
    fallbackGradient: "from-lime-400 via-green-500 to-emerald-600",
  },
  {
    title: "Indira Gandhi Zoological Park",
    distance: "8 km",
    time: "15 min drive",
    description:
      "One of the largest zoos in India, home to a wide variety of animals and birds. A great weekend destination.",
    image: "/prime-location/zoo.jpeg",
    fallbackGradient: "from-teal-400 via-green-500 to-lime-600",
  },
];

function LocationCard({ location }: { location: Location }) {
  return (
    <div className="relative overflow-hidden rounded-3xl cursor-pointer group h-80 w-56 md:h-[28rem] md:w-80 flex-shrink-0">
      {/* Photo */}
      <div className="absolute inset-0">
        <Image
          src={location.image}
          alt={location.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 224px, 320px"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/75 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-white/90 text-xs font-semibold bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Navigation size={10} />
              {location.distance}
            </span>
            <span className="flex items-center gap-1.5 text-white/90 text-xs font-semibold bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Clock size={10} />
              {location.time}
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-white text-xl md:text-2xl font-bold leading-tight mb-2">
            {location.title}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
            {location.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NearbyAttractions() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="container-custom relative">
        {/* Section Header */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 lg:mb-10">
          <div className="max-w-xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
              Prime Location
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy mb-4">
              Perfectly placed in Rushikonda.
            </h2>
            <p className="text-text-secondary text-lg">
              Steps from the beach, close to top colleges and IT parks — the best
              of Visakhapatnam is right at your doorstep.
            </p>
          </div>
          {/* Scroll arrows */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-navy hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full bg-navy flex items-center justify-center text-white hover:bg-primary transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </AnimatedSection>
      </div>

      {/* Scrollable carousel — full bleed */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-4 px-4 md:px-8 lg:px-[calc((100vw-1280px)/2+2rem)] py-4">
          {locations.map((loc) => (
            <LocationCard key={loc.title} location={loc} />
          ))}
          {/* End spacer */}
          <div className="w-4 flex-shrink-0" />
        </div>
      </div>

      {/* Map CTA */}
      <div className="container-custom relative mt-8 lg:mt-12">
        <AnimatedSection delay={0.2}>
          <div className="relative bg-navy rounded-2xl p-8 lg:p-10 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative text-center sm:text-left">
              <h3 className="font-heading text-2xl font-bold text-white mb-2">
                Find Us on the Map
              </h3>
              <p className="text-white/60 max-w-md text-sm">
                Located in scenic Rushikonda, just a stone&apos;s throw from the
                beach and perfectly connected to the city.
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Murams+Living+Rushikonda+Visakhapatnam"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group flex items-center gap-3 px-7 py-3.5 bg-white text-navy font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shrink-0 text-sm"
            >
              <MapPin size={16} />
              <span>Open in Google Maps</span>
              <ExternalLink
                size={13}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
