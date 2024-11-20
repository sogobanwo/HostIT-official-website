import React from "react";
import FeaturesCard from "./FeaturesCard";
import { Button } from "../ui/button";
import {
  featuresCardDetails1,
  featuresCardDetails2,
} from "@/app/dummy-data/data";

type Props = {};

const FeaturesSection = (props: Props) => {
  return (
    
      <div className="max-w-[1280px] mx-auto justify-between flex items-center flex-row flex-wrap space-x-4 my-20 ">
        <div className="flex space-x-8 z-50">
          <div className="flex flex-col md:mt-20">
            {featuresCardDetails1.map((details, index) => {
              return (
                <FeaturesCard
                  header={details.header}
                  body={details.body}
                  key={index}
                />
              );
            })}
          </div>
          <div className="flex flex-col">
            {featuresCardDetails2.map((details, index) => {
              return (
                <FeaturesCard
                  header={details.header}
                  body={details.body}
                  key={index}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-5 z-50 text-white w-full md:w-[550px]">
          <h1 className="font-semibold text-5xl">Our Features</h1>
          <p>
            HostIT, we’re rewriting the rules of event ticketing. Our platform
            enables organizers to manage events seamlessly, while attendees
            benefit from fast, secure on-chain verification, eliminating the
            risk of fake tickets and the frustrations of manual check-ins.
          </p>
          <p>
            By leveraging smart contracts, digital collectibles, and real-time
            analytics, HostIT is helping events run smoothly from start to
            finish, delivering a new standard in event management.
          </p>
          <Button className="w-60 mt-4 md:mt-0 md:w-80 bg-principal border border-principal text-textPrincipal text-base font-semibold py-4 px-4 rounded-full hover:text-principal hover:bg-transparent md:py-6 md:px-12 md:text-xl">
            Learn More
          </Button>
        </div>
      </div>
  );
};

export default FeaturesSection;
