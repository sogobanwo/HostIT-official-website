import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const EventCard = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center m-2 bg-subsidiary border border-principal py-5 px-3 text-white w-[580px] z-50 relative rounded-md">
      <Image src="/event-1-image.png" width={218} height={256} alt="event-image" objectFit="fill"/>
      <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-principal font-semibold text-xl">14/11</h1>
            <div className="flex items-center">
            <div className="bg-[#3E7D71] py-2 px-2 clip-path-polygon-left"></div>
            <div className="bg-[#3E7D71] text-white w-32 py-1 text-lg font-semibold text-center rounded-sm">
              Free
            </div>
            <div className="bg-[#3E7D71] py-2 px-2 clip-path-polygon-right"></div>
            </div>
          </div>
        <div>
        <h1 className="text-xl font-semibold">DevFest Lagos 2024</h1>
        <p className="text-base font-semibold">Lagos, Nigeria</p>
        </div>
        <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at arcu varius, suscipit leo ut, gravida tortor. Morbi nec arcu ex. Pellentesque elementum accumsan felis. </p>
        <Button className="bg-principal border border-principal text-textPrincipal text-base font-semibold py-2 px-4 rounded-full hover:text-principal hover:bg-transparent md:py-3 md:px-6 md:text-base">View detials</Button>
      </div>
    </div>
  );
};

export default EventCard;