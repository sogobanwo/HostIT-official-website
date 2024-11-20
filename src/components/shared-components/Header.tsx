"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { useIsSmallMobile } from "@/hooks/use-mobile";
import Link from "next/link";

const Header = () => {
  const isSmallMobile = useIsSmallMobile();
  return (
    <div
      className="flex justify-between items-center my-8 mx-2 xl:mx-0"
      key="header"
    >

      <Link href={"/"} className="relative z-50">
        <Image
          src={isSmallMobile ? "/hostit-mobile-logo.png" : "/hostit-logo.png"}
          alt="hostit-logo"
          width={isSmallMobile ? 50 : 200}
          height={50}
         
        />
      </Link>

      <div className="flex space-x-3">
        <Link href={"/events"} className="relative z-50">
          <Button className="bg-transparent border border-principal text-principal font-semibold rounded-full hover:bg-principal hover:text-textPrincipal text-base px-4 py-2 md:py-6 md:px-12 md:text-xl relative z-50">
            Discover
          </Button>
        </Link>
        <Link href={"/events"} className="relative z-50">
          <Button className="bg-principal border border-principal text-textPrincipal text-base font-semibold py-2 px-4 rounded-full hover:text-principal hover:bg-transparent md:py-6 md:px-12 md:text-xl relative z-50">
            Create Events
          </Button>
        </Link>

      </div>
    </div>
  );
};

export default Header;
