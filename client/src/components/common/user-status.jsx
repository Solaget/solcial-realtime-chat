import React from "react";

const UserStatus = ({ children, status }) => {
  return (
    <div className="w-fit relative">
      {status === "online" ? (
        <div className="absolute bottom-[3px] right-[3px] z-[20] w-[12px] h-[12px] bg-[#44d44e] rounded-full grid place-content-center" />
      ) : (
        <div className="absolute bottom-[3px] right-[3px] z-[20] w-[12px] h-[12px] bg-[#818181] rounded-full grid place-content-center" />
      )}

      {children}
    </div>
  );
};

export default UserStatus;
