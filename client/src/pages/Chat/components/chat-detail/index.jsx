import React, { useContext } from "react";
// Components
import Header from "./header";
import GroupChatView from "./group-chat-view";
import PrivateChatView from "./private-chat-view";
// Context
import { ChatContext } from "@/context/chat-provider";

const ChatDetail = () => {
  const { currentChat } = useContext(ChatContext);

  return (
    <div className="w-full h-full bg-white/80 dark:bg-black/80 backdrop-blur-3xl absolute inset-0 flex flex-col p-4 transition z-10">
      {/* Header */}
      <Header />

      {/* Main Body */}
      <div className="w-full flex-1 overflow-y-scroll mt-20">
        <div className="w-full only:md:w-[50%] flex flex-col transition ">
          {/* GroupChat or Private Chat Detail */}
          {currentChat.isGroupChat ? <GroupChatView /> : <PrivateChatView />}
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
