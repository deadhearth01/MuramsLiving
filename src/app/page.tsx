import Hero from "@/components/home/Hero";
import Welcome from "@/components/home/Welcome";
import RoomTypes from "@/components/home/RoomTypes";
import Highlights from "@/components/home/Highlights";
import AmenitiesSection from "@/components/home/AmenitiesSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import Testimonials from "@/components/home/Testimonials";
import NearbyAttractions from "@/components/home/NearbyAttractions";
import Rules from "@/components/home/Rules";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Welcome />
      <RoomTypes />
      <Highlights />
      <AmenitiesSection />
      <GalleryPreview />
      <Testimonials />
      <NearbyAttractions />
      <Rules />
      <CTASection />
    </>
  );
}
