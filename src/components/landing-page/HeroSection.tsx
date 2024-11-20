import React from "react";
import Header from "../shared-components/Header";
import { Button } from "../ui/button";
import Image from "next/image";
import { useIsSmallMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

const HeroSection = () => {
  const isSmallMobile = useIsSmallMobile();

  return (
    <div className="overflow-x-hidden overflow-y-hidden bg-gradient-to-tr from-[#595858] to-[#000107] relative w-full">
      <motion.img
        src="/dot.png"
        alt="Background Image 1"
        className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2"
      //   initial={{ top: 1 / 4 }}
      //   animate={{ top: 1 / 2 }
      // }
      //   transition={{
      //     duration: 5,
      //     repeat: Infinity,
      //     ease: "easeOut",
      //     bounce: 0.5,
      //   }}
      />
      <img
        src="/dots.png"
        alt="Background Image 2"
        className="absolute hidden md:flex top-[3%] right-[42%]"
      />
      <img
        src="/right-hero-glow.png"
        alt="Background Image 3"
        className="absolute bottom-0 w-full h-full hidden lg:flex"
      />
      <img
        src="/dot.png"
        alt="Background Image 4"
        className="absolute bottom-0 left-0"
      />
      <img
        src="dots.png"
        alt="Background Image 5"
        className="absolute -bottom-36 left-1/4"
      />
      <motion.img
        src="/dot.png"
        alt="Background Image 6"
        className="absolute bottom-1/4 right-[45%]"
        initial={{ bottom: 1 / 4 }}
        animate={{ bottom: 1 / 2 }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeOut",
          bounce: 0.5,
        }}
      />
      <img
        src="/dot.png"
        alt="Background Image 7"
        className="absolute top-[10%] left-0"
      />
      <img
        src="/dots.png"
        alt="Background Image 8"
        className="absolute top-[15%] -left-10 rotate-45"
      />

      <div className="max-w-[1280px] mx-auto my-3 z-20 relative">
        <Header />
        <div className="flex flex-wrap-reverse justify-between items-center mx-6 md:mx-2 my-12 md:my-20 h-full gap-8">
          <div className="flex flex-col gap-2 md:gap-8">
            <h1 className="font-medium text-3xl md:text-6xl text-white">
              Secure your <span className="text-principal italic">Events</span>
            </h1>
            <h1 className="font-medium text-3xl md:text-6xl text-white">
              with Confidence!
            </h1>
            <div className="font-normal text-lg md:text-3xl text-white md:w-[470px]">
              The future of ticketing is here—decentralized, transparent, and
              fully secure.
            </div>
            <Button className="w-60 mt-4 md:mt-0 md:w-80 bg-principal border border-principal text-textPrincipal text-base font-semibold py-4 px-4 rounded-full hover:text-principal hover:bg-transparent md:py-6 md:px-12 md:text-xl">
              Get Started
            </Button>
          </div>
          <Image
            src="/hero-image.png"
            alt="hero-image"
            width={isSmallMobile ? 200 : 600}
            height={750}
            className="hidden sm:flex"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
