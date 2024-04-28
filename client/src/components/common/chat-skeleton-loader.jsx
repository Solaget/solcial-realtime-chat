import React from "react";
import { Skeleton } from "../ui/skeleton";

const ChatSkeletonLoader = ({ length = 4 }) => (
  <div className="flex flex-col gap-2 w-full px-2 md:px-4">
    {[...Array(length)].map((_, idx) => (
      <div className="flex gap-1 items-center w-full" key={idx}>
        <Skeleton className="h-[50px] w-[50px] rounded-full" />
        <div className="flex flex-col w-full gap-1">
          <Skeleton className="h-[15px] w-[75%] " />
          <Skeleton className="h-[15px] w-[40%]" />
        </div>
      </div>
    ))}
  </div>
);

export default ChatSkeletonLoader;
