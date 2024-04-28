import React from "react";

const OnlineIndicator = ({ isOnline = true }) => {
  return isOnline ? (
    <div className="size-2 rounded-full bg-[#4be44b]" />
  ) : (
    <div className="size-2 rounded-full bg-red-600" />
  );
};

export default OnlineIndicator;
