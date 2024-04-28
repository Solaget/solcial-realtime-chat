import React from "react";
import uploadsBaseUrl from "../../config/server-url";
const Avatar = ({ src, style, withOnlineIndicator, isOnline }) => {
  return (
    <div
      style={style}
      className=" h-full aspect-square rounded-full bg-avatar-bg"
    >
      <div className=" h-full aspect-square rounded-full overflow-hidden">
        <img
          src={uploadsBaseUrl + src}
          alt="no found"
          className="w-full h-full object-cover"
        />
      </div>

      {withOnlineIndicator &&
        (isOnline ? (
          <span className="size-3 rounded-full bg-[#7bff7b] " />
        ) : (
          <span className="size-3 rounded-full bg-[red] " />
        ))}
    </div>
  );
};

export default Avatar;
