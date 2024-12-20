import React from "react";

type Props = {};

const EventTag = ({paid}: {paid: Boolean}) => {
  return (
    <div className="flex items-center">
      <div className={`${paid? "bg-[#2D2848]": "bg-[#3E7D71]"}  py-2 px-2 clip-path-polygon-left`}></div>
      <div className={`${paid? "bg-[#2D2848]": "bg-[#3E7D71]"}  ${paid? "text-principal": "text-white"}  w-32 py-1 text-lg font-semibold text-center rounded-sm`}>
       {paid? "PAID": "FREE"} 
      </div>
      <div className={`${paid? "bg-[#2D2848]": "bg-[#3E7D71]"}  py-2 px-2 clip-path-polygon-right`}></div>
    </div>
  );
};

export default EventTag;
