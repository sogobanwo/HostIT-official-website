import React from "react";

type Props = {};

const EventTag = (props: Props) => {
  return (
    <div className="flex items-center">
      <div className="bg-[#3E7D71] py-2 px-2 clip-path-polygon-left"></div>
      <div className="bg-[#3E7D71] text-white w-32 py-1 text-lg font-semibold text-center rounded-sm">
        Free
      </div>
      <div className="bg-[#3E7D71] py-2 px-2 clip-path-polygon-right"></div>
    </div>
  );
};

export default EventTag;
