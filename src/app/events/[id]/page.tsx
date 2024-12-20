"use client";

import { detailsTabs, dummyEvents } from "@/components/data";
import EventScheduleItem from "@/components/events/EventScheduleItem";
import EventTable from "@/components/events/EventTable";
import EventTag from "@/components/events/EventTag";
import EventTicketPrice from "@/components/events/EventTicketPrice";
import EventWorkshopItem from "@/components/events/EventWorkshopItem";
import { Button } from "@/components/ui/button";
import { epochToDatetime } from "datetime-epoch-conversion";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const page = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const params = useParams<{ id: string }>();
  const eventDetails = dummyEvents.find(
    (event) => event.eventId === Number(params.id)
  );
  const {
    eventName,
    eventStartDate,
    eventLocation,
    description,
    numberOfTickets,
    paid,
    schedule,
    ticketsType,
    workshops,
    speakers,
    sponsors,
  }: any = eventDetails;

  const response = epochToDatetime(`${eventStartDate}`);

  return (
    <div className="my-12 flex justify-center items-center">
      <div className=" flex flex-col gap-10">
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
                {eventLocation}
              </p>
            </div>
            <div
              className={`${
                paid ? "flex" : "hidden"
              }  mt-10  gap-3 flex-grow flex-wrap`}
            >
              {ticketsType.map(
                (
                  { type, price }: { type: string; price: number },
                  index: React.Key | null | undefined
                ) => (
                  <EventTicketPrice
                    key={index}
                    price={price}
                    ticketType={type}
                  />
                )
              )}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex justify-between ">
              <EventTag paid={paid} />
              <Button className="bg-principal border border-principal text-textPrincipal text-base font-semibold py-2 px-4 rounded-full hover:text-principal hover:bg-transparent md:py-3 md:px-6 md:text-base">
                Register
              </Button>
            </div>
            <div className="gap-4">
              <div className="text-4xl font-semibold text-white">
                {eventName}
              </div>
              <div className="flex items-center gap-4">
                <h1 className="text-principal text-2xl font-semibold">
                  {response.day} {response.month}, {response.year}
                </h1>
                <Image src={"/oui_dot.png"} alt="dot" width={20} height={20} />
                <h1 className="text-principal text-2xl font-semibold">
                  {response.time}
                </h1>
              </div>
            </div>
            <p className="text-white w-[620px]">{description}</p>
            <Tabs
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList
                className={
                  "border-[#F5F5F5] border rounded-md flex justify-evenly text-white mb-6"
                }
              >
                {detailsTabs.map((eachTab, index) => (
                  <Tab
                    key={index}
                    selectedClassName="bg-principal font-semibold text-black"
                  >
                    {eachTab}
                  </Tab>
                ))}
              </TabList>

              <TabPanel
                className={`${
                  tabIndex === 0 ? "" : "hidden"
                }  border border-principal p-4 rounded-md bg-subsidiary text-white`}
              >
                {schedule.map(
                  (
                    eachSchedule: {
                      time: string;
                      title: string;
                      description: string;
                    },
                    index: React.Key | null | undefined
                  ) => (
                    <EventScheduleItem
                      scheduleItem={eachSchedule}
                      key={index}
                    />
                  )
                )}
              </TabPanel>
              <TabPanel
                className={`${
                  tabIndex === 1 ? "" : "hidden"
                } border border-principal p-4 rounded-md bg-subsidiary text-white`}
              >
                <EventTable ticketsType={ticketsType} />
              </TabPanel>
              <TabPanel
                className={`${
                  tabIndex === 2 ? "" : "hidden"
                } border border-principal p-4 rounded-md bg-subsidiary text-white`}
              >
                {workshops.map(
                  (
                    eachWorkshop: {
                      name: string;
                      description: string;
                    },
                    index: React.Key | null | undefined
                  ) => (
                    <EventWorkshopItem
                      workshopItem={eachWorkshop}
                      itemNo={index}
                      key={index}
                    />
                  )
                )}
              </TabPanel>
              <TabPanel
                className={`${
                  tabIndex === 3 ? "" : "hidden"
                } border border-principal p-4 rounded-md bg-subsidiary text-white `}
              >
                <div className="flex flex-wrap gap-3">
                  {speakers.map(
                    (
                      {
                        name,
                        img,
                        description,
                      }: { name: string; img: string; description: string },
                      index: React.Key | null | undefined
                    ) => (
                      <div
                        key={index}
                        className="flex flex-col justify-center items-center gap-1 flex-grow"
                      >
                        <Image src={img} alt={name} width={100} height={100} />
                        <h1 className="font-semibold text-white text-lg">
                          {name}
                        </h1>
                        <p className="font-sm text-white">{description}</p>
                      </div>
                    )
                  )}
                </div>
              </TabPanel>
              <TabPanel
                className={`${
                  tabIndex === 4 ? "" : "hidden"
                } border border-principal p-4 rounded-md bg-subsidiary text-white`}
              >
                <div className="flex items-center gap-4 flex-wrap flex-grow">
                  {sponsors.map(
                    (
                      {
                        type,
                        img,
                      }: {
                        type: string;
                        img: string;
                      },
                      index: React.Key | null | undefined
                    ) => (
                      <Image
                        src={img}
                        alt={type}
                        width={150}
                        height={50}
                        key={index}
                        objectFit="center"
                      />
                    )
                  )}{" "}
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
        <div className="bg-subsidiary border border-principal py-5  text-white flex items-center  rounded-md justify-evenly w-full">
          <div className="flex justify-center items-center">
            <h1 className="text-white font-semibold text-4xl">
              {numberOfTickets}
            </h1>
            <p className="text-white font-extralight text-5xl">|</p>
            <p className="text-sm text-white italic text-right">Attendees</p>
          </div>
          <div className="flex justify-center items-center">
            <h1 className="text-white font-semibold text-4xl">
              {speakers.length}
            </h1>
            <p className="text-white font-extralight text-5xl">|</p>
            <p className="text-sm text-white italic text-right">Speaker</p>
          </div>
          <div className="flex justify-center items-center">
            <h1 className="text-white font-semibold text-4xl">
              {sponsors.length}
            </h1>
            <p className="text-white font-extralight text-5xl">|</p>
            <p className="text-sm text-white italic text-right">Sponsors</p>
          </div>
          <div className="flex justify-center items-center">
            <h1 className="text-white font-semibold text-4xl">
              {numberOfTickets}
            </h1>
            <p className="text-white font-extralight text-5xl">|</p>
            <p className="text-sm text-white italic text-right">Tickets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
