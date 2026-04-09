"use client";

import React from "react";
import { MapPin, ExternalLink, Navigation, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

interface Location {
  title: string;
  category: string;
  distance: string;
  time: string;
  description: string;
  gradient: string;
}

const locations: Location[] = [
  {
    title: "Rushikonda Beach",
    category: "1 km · 5 min walk",
    distance: "1 km",
    time: "5 min walk",
    description:
      "Beautiful golden sandy beach perfect for morning walks and evening relaxation. One of Vizag's most loved beaches, just steps from your door.",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
  },
  {
    title: "Gitam Medical College",
    category: "0.5 km · 3 min walk",
    distance: "0.5 km",
    time: "3 min walk",
    description:
      "Prestigious medical college and hospital within walking distance. Perfect for medical students and healthcare professionals.",
    gradient: "from-emerald-400 via-green-500 to-teal-600",
  },
  {
    title: "IT SEZ / Tech Park",
    category: "4 km · 10 min drive",
    distance: "4 km",
    time: "10 min drive",
    description:
      "Major IT hub with top technology companies like Wipro, TCS, and Infosys. Short commute for working professionals.",
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
  },
  {
    title: "Food & Restaurants",
    category: "0.8 km · 5 min walk",
    distance: "0.8 km",
    time: "5 min walk",
    description:
      "Various restaurants, cafes, street food stalls, and food courts nearby offering cuisines from all over India.",
    gradient: "from-orange-400 via-red-500 to-rose-600",
  },
  {
    title: "Railway Station",
    category: "15 km · 25 min drive",
    distance: "15 km",
    time: "25 min drive",
    description:
      "Major railway junction connecting all major cities across India. Well-connected via city buses and autos.",
    gradient: "from-slate-500 via-gray-600 to-zinc-700",
  },
  {
    title: "Visakhapatnam Airport",
    category: "22 km · 35 min drive",
    distance: "22 km",
    time: "35 min drive",
    description:
      "International airport with domestic and international flights connecting Vizag to major cities worldwide.",
    gradient: "from-blue-400 via-sky-500 to-cyan-600",
  },
];

function LocationCardContent({ location }: { location: Location }) {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center gap-1.5 text-sm text-gray-500">
          <Navigation size={14} className="text-primary" />
          {location.distance}
        </span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span className="flex items-center gap-1.5 text-sm text-gray-500">
          <Clock size={14} />
          {location.time}
        </span>
      </div>
      <p className="text-gray-700 leading-relaxed">{location.description}</p>
    </div>
  );
}

function GradientCard({ location }: { location: Location }) {
  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${location.gradient} rounded-3xl`}
    />
  );
}

export default function NearbyAttractions() {
  const cards = locations.map((loc, index) => ({
    src: "",
    title: loc.title,
    category: loc.category,
    content: <LocationCardContent location={loc} />,
    gradient: loc.gradient,
  }));

  const carouselItems = locations.map((loc, index) => {
    const cardData = {
      src: "",
      title: loc.title,
      category: loc.category,
      content: <LocationCardContent location={loc} />,
    };
    return (
      <div key={loc.title} className="relative">
        <LocationCard location={loc} index={index} />
      </div>
    );
  });

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="container-custom relative">
        {/* Section Header */}
        <AnimatedSection className="max-w-3xl mb-4 lg:mb-6">
          <p className="text-primary font-semibold text-sm uppercase tracking-[0.15em] mb-4">
            Prime Location
          </p>

          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy mb-4">
            Perfectly placed in Rushikonda.
          </h2>

          <p className="text-text-secondary text-lg max-w-xl">
            Steps from the beach, close to top colleges and IT parks — the best
            of Visakhapatnam is right at your doorstep.
          </p>
        </AnimatedSection>
      </div>

      {/* Carousel — full bleed */}
      <LocationCarousel />

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

function LocationCard({
  location,
  index,
}: {
  location: Location;
  index: number;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl cursor-pointer group
        h-80 w-56 md:h-[28rem] md:w-80
        bg-gradient-to-br ${location.gradient}
        flex-shrink-0
      `}
    >
      {/* Top fade for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/60 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
        <div>
          <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
            {location.category.split(" · ")[1]}
          </p>
          <h3 className="text-white text-xl md:text-2xl font-bold leading-tight">
            {location.title}
          </h3>
        </div>
        <div className="space-y-3">
          <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
            {location.description}
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white/90 text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Navigation size={11} />
              {location.distance}
            </span>
            <span className="flex items-center gap-1.5 text-white/90 text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock size={11} />
              {location.time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LocationCarousel() {
  return (
    <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-4 px-4 md:px-8 lg:px-[calc((100vw-1280px)/2+2rem)] py-6">
        {locations.map((loc, index) => (
          <LocationCard key={loc.title} location={loc} index={index} />
        ))}
        {/* Spacer for last card */}
        <div className="w-4 flex-shrink-0" />
      </div>
    </div>
  );
}
