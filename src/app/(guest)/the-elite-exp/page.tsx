"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { FaUsersRectangle } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

const Page = () => {
  const [eventName, setEventName] = useState("");
  const [organizerToken, setOrganizerToken] = useState("");
  const router = useRouter();

   useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("TEE-africa_logged_in");
      if (isLoggedIn === "true") {
        router.push("/the-elite-exp/event-analytics");
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
    eventName === process.env.NEXT_PUBLIC_EVENT_NAME &&
    organizerToken === process.env.NEXT_PUBLIC_EVENT_TOKEN
  ) {
    localStorage.setItem("TEE-africa_logged_in", "true");
    router.push("/the-elite-exp/event-analytics");
  } else {
    toast.error("Invalid event name or token.");
  }
  };

  return (
    <div className="w-full flex items-center justify-center h-[100vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key="organizer-login"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full"
        >
          <div className="2xl:max-w-[1200px] max-w-[1024px] min-h-screen mx-auto flex flex-col 2xl:pt-28 pt-10 2xl:gap-10">
            <Image
              src={"/logo.png"}
              width={149}
              height={47}
              alt="HostIt logo"
              className="mx-auto mb-8 hidden md:flex"
            />
            <h1 className="text-center 2xl:text-6xl text-4xl font-bold bg-gradient-to-r from-[#007CFA] from-30% to-white to-95% bg-clip-text text-transparent mb-8">
              Delegate Login
            </h1>
            <div className="flex flex-col items-center justify-center">
              <Card className="w-[85%] md:w-[50%] my-4 bg-transparent border border-gray-500 p-8 relative flex justify-center items-center">
                <div className="absolute top-0 left-0 p-4">
                  <FaUsersRectangle
                    size={50}
                    className="text-subsidiary group-hover:text-white -ml-8 -mt-8 -rotate-45"
                  />
                </div>
                <form className="w-full flex flex-col gap-6" onSubmit={handleLogin}>
                  <input
                    type="text"
                    placeholder="Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Organizer's Secret Token"
                    value={organizerToken}
                    onChange={(e) => setOrganizerToken(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="2xl:text-xl text-lg h-12 2xl:h-14 w-full font-semibold rounded-lg bg-subsidiary hover:bg-white hover:text-subsidiary text-white transition"
                  >
                    Log in
                  </button>
                </form>
              </Card>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Page;