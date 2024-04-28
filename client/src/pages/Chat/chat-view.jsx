import { useEffect, useContext } from "react";
// Context
import { ChatContext } from "@/context/chat-provider";
// Components
import ChatsListContainer from "./components/sidebar/index";
import ConversationView from "./components/conversation/index";
import EmptyChatView from "./components/empty-chat-view";
// Hooks
import useMedia from "@/hooks/useMedia";

const ChatView = () => {
  const ChatStates = useContext(ChatContext);
  let currentChat;

  if(ChatStates){
    currentChat = ChatStates.currentChat;
  }
  const isMdScreen = useMedia("(max-width: 768px)");

  return (
    <div className="flex w-full h-screen relative">
      {isMdScreen ? (
        currentChat ? (
          <ConversationView />
        ) : (
          <div className="w-full">
            <ChatsListContainer />
          </div>
        )
      ) : (
        <>
          <div className="w-[365px]">
            <ChatsListContainer />
          </div>
          {!currentChat ? <EmptyChatView /> : <ConversationView />}
        </>
      )}
    </div>
  );
};

export default ChatView;
