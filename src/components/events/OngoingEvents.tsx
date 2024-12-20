import React from "react";
import { Button } from "../ui/button";
import EventCard from "./EventCard";
import { dummyEvents } from "../data";

const OngoingEvents = () => {
  return (
    <div className="z-50 max-w-[1280px] mx-auto flex flex-col justify-center my-5 gap-5">
      <h1 className="text-center text-white text-4xl font-semibold mb-6">
        Ongoing Events
      </h1>
      <div className="flex flex-wrap justify-center">
        {dummyEvents.map(
          (
            { eventStartDate, eventName, eventLocation, description, paid },
            index
          ) => (
            <EventCard
              key={index}
              date={eventStartDate}
              eventName={eventName}
              eventLocation={eventLocation}
              description={description}
              paid={paid}
              index={index}
            />
          )
        )}
      </div>
      <div className="flex justify-center">
        <Button className="w-60 mt-4 md:mt-0 md:w-80 bg-principal border border-principal text-textPrincipal text-base font-semibold py-4 px-4 rounded-full hover:text-principal hover:bg-transparent md:py-6 md:px-12 md:text-xl relative z-50 ">
          Load More...
        </Button>
      </div>
    </div>
  );
};

export default OngoingEvents;
