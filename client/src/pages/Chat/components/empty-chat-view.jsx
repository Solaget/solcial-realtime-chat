import React from "react";
import { FaFacebookMessenger } from "react-icons/fa";

const EmptyChatView = () => {
  return (
    <div className=" flex-1 h-full flex flex-col gap-2 items-center justify-center bg-secondary">
      <span className="text-xl">There is no selected Chat Here</span>
      <FaFacebookMessenger className="text-3xl" />
    </div>
  );
};

export default EmptyChatView;


