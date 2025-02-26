"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { BsFillRocketTakeoffFill } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FaTelegramPlane } from "react-icons/fa";
import { FaSquareXTwitter, FaYoutube } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex justify-between items-center border border-subsidiary rounded-[35px] max-w-[892px] md:mx-auto mx-4 py-3 md:py-4 px-5 md:px-10 mt-5 md:mt-10">
      <Link href={"/"}>
        <Image
          src={"/logo.png"}
          width={149}
          height={47}
          alt="HostIt logo"
          className="hidden md:flex"
        />
        <Image
          src={"/mobile-logo.png"}
          width={30}
          height={30}
          alt="HostIt logo"
          className="flex md:hidden"
        />
      </Link>
      <Dialog>
        <DialogTrigger className="flex items-center gap-2 text-white md:text-lg bg-subsidiary px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-black">
          Launch dApp <BsFillRocketTakeoffFill />
        </DialogTrigger>
        <DialogContent className="bg-principal border-subsidiary">
          <DialogHeader className="flex flex-col gap-6">
            <DialogTitle className="text-3xl text-center bg-gradient-to-r from-[#007CFA] from-30% to-white to-90% bg-clip-text text-transparent">
              Big things are brewing! <br />
              Our next launch is coming soon.
              <br />
              Watch this space!
            </DialogTitle>
            <DialogDescription className="text-text text-center text-xl flex flex-col gap-6">
              Follow us on our socials to stay updated
              <div className="flex gap-4 justify-center">
                <a
                  href="https://t.me/hostitevents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTelegramPlane size={30} color={"#C8C8C8"} />
                </a>
                <a
                  href="https://www.instagram.com/hostitevents/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <RiInstagramFill size={30} color={"#C8C8C8"} />
                </a>
                <a
                  href="https://www.youtube.com/@hostitevents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  <FaYoutube size={30} color={"#C8C8C8"} />
                </a>
                <a
                  href="https://x.com/hostit_events"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  <FaSquareXTwitter size={30} color={"#C8C8C8"} />
                </a>
              </div>
              <div className="mt-4 flex flex-col items-center gap-4">
                <p className="text-text text-xl">
                  Do you want to host an event? Request our services 👇
                </p>
                <a
                  href="https://calendly.com/fullstackchat/30min"
                  target="_blank"
                >
                  <Button className="flex items-center justify-center gap-2 text-white text-lg bg-subsidiary p-6 mx-auto">
                    Request Our Services
                  </Button>
                </a>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
