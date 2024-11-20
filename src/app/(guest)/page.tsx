"use client";

import FeaturesSection from "@/components/landing-page/FeaturesSection";
import HeroSection from "@/components/landing-page/HeroSection";
import Footer from "@/components/shared-components/Footer";
import React from "react";

const page = () => {
  return (
    <>
      <HeroSection />
      <div className="overflow-x-hidden overflow-y-hidden bg-gradient-to-tr from-[#595858] to-[#000107] relative w-full">
      <img
        src="/left-glow.png"
        alt="Background Image 2"
        className="absolute hidden md:flex -top-20 left-0"
      />
      <img
        src="/right-glow.png"
        alt="Background Image 3"
        className="absolute -top-12 right-0 hidden md:flex"
      />
      <img
        src="/line-pattern.png"
        alt="Background Image 4"
        className="absolute top-1/4 left-0 w-full"
      />
      <FeaturesSection />
      <Footer />
      </div>
    </>
  );
};

export default page;
