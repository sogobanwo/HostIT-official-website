"use client";

import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { useRouter } from "next/navigation";
import TicketPoap from "@/components/dashboard/TicketPoap";
import { IoIosShareAlt } from "react-icons/io";
import GooMap from "@/components/map";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GiPadlock } from "react-icons/gi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BsFolder } from "react-icons/bs";
import { IoCartOutline } from "react-icons/io5";
import { RiShieldUserLine } from "react-icons/ri";
import { PiBroadcast } from "react-icons/pi";
import { MdMoveToInbox } from "react-icons/md";
import { MdOutlineQrCodeScanner } from "react-icons/md"; 
import CheckInTab from "@/components/dashboard/CheckinTab";

const Page = () => {
 const router = useRouter();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchRegistrations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/general-registrations/`);
        const data = await res.json();
        setRegistrations(data.results || []);
        setCount(data.count || 0);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchRegistrations();
    intervalId = setInterval(fetchRegistrations, 10000);

    return () => clearInterval(intervalId);
  }, []);  
  return (
    <Tabs defaultValue="details" className="w-full">
      <div className="mx-4 sm:mx-6 lg:mx-8 2xl:mx-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 w-full">
          {/* Navigation and Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full lg:w-4/5 2xl:w-2/3 gap-4">
            <div
              className="h-10 flex justify-center items-center w-16 rounded-lg font-semibold bg-subsidiary hover:bg-white hover:text-subsidiary hover:cursor-pointer text-white"
              onClick={() => router.back()}
            >
              <IoIosArrowRoundBack size={40} />
            </div>

            {/* Mobile Tabs - Horizontal scroll */}
            <div className="w-full sm:w-auto overflow-x-auto">
              <TabsList className="flex gap-2 sm:gap-6 bg-transparent border-subsidiary border h-12 min-w-max">
                <TabsTrigger
                  value="details"
                  className="flex gap-1 text-center items-center justify-center text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  <BsFolder size={16} className="sm:w-5 sm:h-5" />
                  <span className="sm:inline">Details</span>
                </TabsTrigger>
                <TabsTrigger
                  value="live-updates"
                  className="flex gap-1 text-center items-center justify-center text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  <PiBroadcast size={16} className="sm:w-5 sm:h-5" />
                  <span className="sm:inline">Live Updates</span>
                </TabsTrigger>
                <TabsTrigger
                  value="merch"
                  className="flex gap-1 text-center items-center justify-center text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  <IoCartOutline size={16} className="sm:w-5 sm:h-5" />
                  <span className="sm:inline">Merch</span>
                </TabsTrigger>
                <TabsTrigger
                  value="role"
                  className="flex gap-1 text-center items-center justify-center text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  <RiShieldUserLine size={16} className="sm:w-5 sm:h-5" />
                  <span className="sm:inline">Role</span>
                </TabsTrigger>
                <TabsTrigger
                  value="check-in"
                  className="flex gap-1 text-center items-center justify-center text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  <MdMoveToInbox size={16} className="sm:w-5 sm:h-5" />
                  <span className="sm:inline">Check-In</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Days Counter */}
          <div className="w-full lg:w-1/5 2xl:w-1/3 flex items-center justify-end">
            <p className="text-white font-medium text-sm sm:text-lg 2xl:text-xl py-2 px-4 sm:px-6 rounded-lg border-2 italic">
              Happening Today!!!
            </p>
          </div>
        </div>

        {/* Details Tab Content */}
        <TabsContent value="details" className="min-h-[82vh]">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 my-4">
            {/* Left Column - Event Image and Description */}
            <div className="w-full lg:w-2/3 relative">
              <img
                src="/web3lagos.jpeg"
                alt="event-image"
                className="w-full rounded-3xl h-48 sm:h-56 2xl:h-64 object-cover"
              />

              <div className="absolute top-4 left-4 px-3 sm:px-4 py-1 rounded-full font-semibold text-sm sm:text-base z-10 border-2 border-white bg-[#13193980] text-white">
                {"Free"}
              </div>

              <div className="my-6 sm:my-8 2xl:my-10 border-2 border-subsidiary rounded-full w-full max-w-xs sm:max-w-sm lg:max-w-md 2xl:w-96 flex justify-center items-center h-12 2xl:h-14 mx-auto lg:mx-0">
                <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-[#007CFA] from-30% to-white to-95% bg-clip-text text-transparent uppercase">
                  Description
                </h1>
              </div>

              <p className="text-white text-base sm:text-lg 2xl:text-xl leading-relaxed mb-4">
                The Web3 Lagos Conference by Web3bridge is a 3-day hybrid event
                designed to onboard, educate, and inspire the next generation of
                blockchain innovators. Through workshops, hackathons, panels,
                and networking, we’re creating a space where both beginners and
                experts can connect, learn, and explore the future of Web3 in
                Africa and beyond.
              </p>

              <p className="text-white text-base sm:text-lg 2xl:text-xl leading-relaxed mb-4">
                Event Overview The Web3 Lagos Conference includes: Hackathons
                Workshops Networking opportunities Career fairs Panel sessions
                Expert talks It’s designed to onboard newcomers and help both
                technical and non-technical individuals discover the endless
                opportunities in the blockchain and Ethereum ecosystem.
              </p>
              <p className="text-white text-base sm:text-lg 2xl:text-xl leading-relaxed mb-4">
                Whether you're a beginner or a blockchain native, the Web3 Lagos
                Conference is for you. Register now to learn, connect, and grow
                in a dynamic 3-day experience that blends education with real
                opportunities.
              </p>
            </div>

            {/* Right Column - Event Details */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 sm:gap-6 mb-14 mb:mb-0">
              {/* Event Title and Date */}
              <div>
                <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-semibold bg-gradient-to-r from-[#007CFA] from-30% to-white to-95% bg-clip-text text-transparent">
                  Web3Lagos Conference 4.0
                </h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center mt-2">
                  <p className="uppercase text-sm sm:text-base 2xl:text-lg text-white">
                    28th - 30th Aug, 2024
                  </p>
                  <GoDotFill className="text-white text-xl hidden sm:block" />
                  <p className="uppercase text-sm sm:text-base 2xl:text-lg text-white">
                    10AM - 4PM WAT Daily
                  </p>
                </div>
              </div>

              {/* Ticket POAP */}
              <TicketPoap isTicket isAttendee={false} />

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4">
                <div className="bg-subsidiary flex justify-center items-center rounded-full h-12 w-12 sm:h-14 sm:w-14">
                  <IoIosShareAlt
                    className="w-6 h-6 sm:w-7 sm:h-7 2xl:w-[30px] 2xl:h-[30px]"
                    color={"#FFFFFF"}
                  />
                </div>
                <Dialog>
                  <DialogTrigger className="text-sm sm:text-base 2xl:text-lg h-12 2xl:h-14 w-32 sm:w-48 2xl:w-56 rounded-lg bg-subsidiary hover:bg-white hover:text-subsidiary text-white font-semibold">
                    Edit Event
                  </DialogTrigger>
                  <DialogContent className="border bg-principal border-subsidiary rounded-3xl p-0 w-[90%] max-w-md">
                    <div className="p-8 sm:p-12 rounded-t-3xl bg-subsidiary w-full flex justify-center items-center">
                      <GiPadlock
                        color="#ffffff"
                        size={60}
                        className="sm:w-[72px] sm:h-[72px]"
                      />
                    </div>
                    <div className="p-6 sm:p-8 flex flex-col justify-center items-center gap-4">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#007CFA] from-30% to-white to-95% bg-clip-text text-transparent text-center">
                        You can not edit this event because you are not the
                        organizer.
                      </h1>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Map */}
              <GooMap />

              {/* POAP */}
              <TicketPoap isTicket={false} isAttendee={false} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="check-in" className="min-h-[82vh] mb-10 lg:mb-0">
          <CheckInTab  />
        </TabsContent>
        <TabsContent
          value="live-updates"
          className="min-h-[82vh] mb-10 lg:mb-0"
        >
          <CheckInTab  />
        </TabsContent>
        <TabsContent value="merch" className="min-h-[82vh] mb-10 lg:mb-0">
          <CheckInTab  />
        </TabsContent>
        <TabsContent value="role" className="min-h-[82vh] mb-10 lg:mb-0">
          <CheckInTab  />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default Page;
