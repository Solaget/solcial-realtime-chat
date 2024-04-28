import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { getChatDisplayInfo } from "@/utils/chat-functionality";
import { ChatContext } from "@/context/chat-provider";

const PrivateChatView = () => {
  const { currentChat } = useContext(ChatContext);
  const loggedUserId = useSelector((state) => state.auth.authInfo._id);
  return (
    <main className="w-full flex flex-col gap-3">
      {/* Bio Area */}
      <div className="flex flex-col gap-1">
        <h3 className='text-md leading-none'>Bio</h3>
        <p className="font-thin text-md leading-none">
          {getChatDisplayInfo(currentChat, loggedUserId).bio
            ? getChatDisplayInfo(currentChat, loggedUserId).bio
            : "There is no bio"}
        </p>
      </div>

      {/* User Email HEre */}
      <div className="flex flex-col gap-1">
        <h3 className='text-md leading-none'>Email</h3>
        <p className="font-thin text-md leading-none">
          {getChatDisplayInfo(currentChat, loggedUserId).email}
        </p>
      </div>

      {/* Joined at */}
      <div className="flex flex-col gap-1">
        <h3 className='text-md leading-none'>Joined at</h3>
        <p className="font-thin text-sm leading-none">
          {new Date(
            getChatDisplayInfo(currentChat, loggedUserId).createdAt
          ).toDateString()}
        </p>
      </div>
    </main>
  );
};

export default PrivateChatView;
