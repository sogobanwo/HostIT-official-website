"use client";
import React from "react";
import { IoFilter } from "react-icons/io5";
import { Button } from "../ui/button";
import { useParams, usePathname, useRouter } from "next/navigation";

type Props = {};

const Header = (props: Props) => {

  return (
    <div className="fixed top-0 w-full z-50 bg-principal h-[12%] flex items-center px-4 2xl:px-10">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center justify-center cursor-pointer">
        <img
          src="/dash-logo.png"
          alt="logo"
          className="w-10 h-14 sm:w-12 sm:h-16 md:w-14 md:h-18 lg:w-16 lg:h-20"
        />
      </div>

      {/* Header Content */}
      <div className="flex-1 flex justify-between items-center ml-4 sm:ml-6">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#007CFA] from-30% to-white to-95% bg-clip-text text-transparent">
          Dashboard
        </h1>

      </div>
    </div>
  );
};

export default Header;
