import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { BsSendFill } from "react-icons/bs";
import { Input } from "../ui/input";


const Footer = () => {
  return (
    <div className="max-w-[1280px] mx-auto ">
      <div className="flex flex-col md:flex-row justify-between items-center mx-2 my-2 gap-5 ">
        <Image src="/hostit-logo.png" alt="hostit-logo" width={100} height={25} />
        <div className="flex gap-4 items-center z-50">
          <Link href="" className="text-principal">Discover</Link>
          <Image src={"/oui_dot.png"} alt="dot" width={16} height={16} />
          <Link href="" className="text-principal">Create Event</Link>
        </div>
        <div>
        <div className="border rounded-md border-principal flex gap-3 bg-transparent text-textPrincipal justify-between items-center z-50">
              <Input
                type="text"
                placeholder="Enter email to subsribe to our newsletter"
                className="border-none bg-transparent px-2 text-textPrincipal z-50"
              />
              <Button className="text-primary bg-principal hover:bg-subsidiary m-1 z-50">
                <BsSendFill size={10}/>
              </Button>
            </div>
        </div>
      </div>
      <hr className="w-full h-0.5 border-slate-400 my-5" />
      <div className="flex flex-col md:flex-row justify-between items-center mx-2 my-5 z-50">
        <div className="flex gap-4 mb-5">
          <Image src={"/copyright-icon.png"} alt={"copyright"} width={24} height={24}/>
          <p className="text-principal">All Rights Reserved, HostIT 2024.</p>
        </div>
        <div className="flex gap-4">
          <Image src={"/telegram-icon.png"} alt={"telegram"} width={24} height={24}/>
          <Image src={"/facebook-icon.png"} alt={"facebook"} width={24} height={24}/>
          <Image src={"/instagram-icon.png"} alt={"instagram"} width={24} height={24}/>
          <Image src={"/youtube-icon.png"} alt={"youtube"} width={24} height={24}/>
          <Image src={"/x-icon.png"} alt={"x"} width={24} height={24}/>
        </div>
      </div>
    </div>
  );
};

export default Footer;
