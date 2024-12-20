import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import EventTag from "./EventTag";
import Link from "next/link";
import { epochToDatetime } from "datetime-epoch-conversion";


const EventCard = ({date, eventName, eventLocation, description, paid, index  }: {date: BigInt, eventName: String, eventLocation: String, description: String, paid: Boolean, index: Number}) => {
  const response = epochToDatetime(`${date}`)
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center m-2 bg-subsidiary border border-principal py-5 px-3 text-white w-[580px] z-50 relative rounded-md">
      <Image
        src="/event-1-image.png"
        width={218}
        height={256}
        alt="event-image"
        objectFit="fill"
        className="w-full md:w-[218px] h-[150px] md:256"
      />
      <div className="flex flex-col gap-3  w-[340px]">
        <div className="flex items-center justify-between">
          <h1 className="text-principal font-semibold text-xl">{response.date}</h1>
          <EventTag paid={paid}/>
        </div>
        <div>
          <h1 className="text-xl font-semibold">{eventName}</h1>
          <p className="text-base font-semibold">{eventLocation}</p>
        </div>
        <p className="text-sm line-clamp-4">
          {description}
        </p>
        <Link href={`/events/${index}`} className="flex justify-end">
          <Button className="bg-principal border border-principal text-textPrincipal text-base font-semibold py-2 px-4 rounded-full hover:text-principal hover:bg-transparent md:py-3 md:px-6 md:text-base">
            View details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
