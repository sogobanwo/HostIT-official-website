"use client";

import EventTag from "@/components/events/EventTag";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const page = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="my-8 flex justify-center items-center">
      <div className="w-3/4 flex flex-col gap-10">
        <div className="flex gap-10">
          <div className="flex flex-col w-96">
            <Image
              src="/event-1-image.png"
              alt="event-image"
              width={384}
              height={467}
            />
            <div className="flex flex-col w-[384px] my-8">
              <Image
                src={"/MapImage.png"}
                alt="map"
                objectFit="fill"
                width={384}
                height={467}
              />
              <p className="bg-[#0D004233] text-black font-semibold w-[90%] rounded-md p-2 mx-5 -m-12">
                The Zone Tech Park, Gbagada.
              </p>
            </div>
            <div></div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex justify-between ">
              <EventTag />
              <Button className="bg-principal border border-principal text-textPrincipal text-base font-semibold py-2 px-4 rounded-full hover:text-principal hover:bg-transparent md:py-3 md:px-6 md:text-base">
                Register
              </Button>
            </div>
            <div className="gap-4">
              <div className="text-4xl font-semibold text-white">
                Web3 Lagos Conference
              </div>
              <div className="flex items-center gap-4">
                <h1 className="text-principal text-2xl font-semibold">
                  14TH November, 2024
                </h1>
                <Image src={"/oui_dot.png"} alt="dot" width={20} height={20} />
                <h1 className="text-principal text-2xl font-semibold">
                  9:00AM
                </h1>
              </div>
            </div>
            <p className="text-white w-[620px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              iure dolore in expedita cumque, commodi incidunt debitis
              recusandae? Labore quam dolore porro, sequi provident ab debitis
              adipisci alias eaque in?
            </p>
            <Tabs  selectedIndex={tabIndex}
      onSelect={(index) => setTabIndex(index)}>
              <TabList
                className={
                  "border-[#F5F5F5] border rounded-md flex justify-evenly text-white mb-6"
                }
              >
                <Tab selectedClassName="bg-principal font-semibold text-black">Schedule</Tab>
                <Tab selectedClassName="bg-principal font-semibold text-black">Tickets</Tab>
                <Tab selectedClassName="bg-principal font-semibold text-black">Workshops</Tab>
                <Tab selectedClassName="bg-principal font-semibold text-black">Speakers</Tab>
                <Tab selectedClassName="bg-principal font-semibold text-black">Sponsors</Tab>
              </TabList>

              <TabPanel className={"border border-principal p-4 rounded-md bg-subsidiary text-white"}>
                <h2>Any content 1</h2>
              </TabPanel>
              <TabPanel className={"border border-principal p-4 rounded-md bg-subsidiary text-white"}>
                <h2>Any content 2</h2>
              </TabPanel>
              <TabPanel className={"border border-principal p-4 rounded-md bg-subsidiary text-white"}>
                <h2>Any content 3</h2>
              </TabPanel>
              <TabPanel className={"border border-principal p-4 rounded-md bg-subsidiary text-white"}>
                <h2>Any content 4</h2>
              </TabPanel>
              <TabPanel className={"border border-principal p-4 rounded-md bg-subsidiary text-white"}>
                <h2>Any content 5</h2>
              </TabPanel>
            </Tabs>
          </div>
        </div>
        <div className="bg-subsidiary border border-principal py-5  text-white flex items-center  rounded-md justify-evenly w-full">
          <div className="flex justify-center items-center">
            <h1 className="text-white font-semibold text-4xl">1500</h1>
            <p className="text-white font-extralight text-5xl">|</p>
            <p className="text-sm text-white italic text-right">Attendees</p>
          </div>
          <div className="flex justify-center items-center">
            <h1 className="text-white font-semibold text-4xl">200</h1>
            <p className="text-white font-extralight text-5xl">|</p>
            <p className="text-sm text-white italic text-right">Speaker</p>
          </div>
          <div className="flex justify-center items-center">
            <h1 className="text-white font-semibold text-4xl">18</h1>
            <p className="text-white font-extralight text-5xl">|</p>
            <p className="text-sm text-white italic text-right">Sponsors</p>
          </div>
          <div className="flex justify-center items-center">
            <h1 className="text-white font-semibold text-4xl">1800</h1>
            <p className="text-white font-extralight text-5xl">|</p>
            <p className="text-sm text-white italic text-right">Tickets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
