import { useContext } from "react";
// Hooks
import { useSelector } from "react-redux";
// Context
import { ChatContext } from "@/context/chat-provider";
// Components
import ConversationContainer from "./conversation-container";
import ConversationFooter from "./conversation-footer";
import ConversationHeader from "./conversation-header";
import ChatDetail from "../chat-detail/index";

const ConversationView = () => {
  const { currentChat, isCurrentChatDetailOpen } = useContext(ChatContext);
  return (
    <div className="flex-1 bg-secondary border-l-2 border-l-border relative">
      {currentChat && (
        <>
          <div className="flex flex-col w-full h-full z-30">
            {/* Top/ CHat header */}
            <ConversationHeader />

            {/* Middle/ Conversation area */}
            <ConversationContainer />

            {/* Bottom / Message Input box */}
            <ConversationFooter />
          </div>
        </>
      )}
      {isCurrentChatDetailOpen && <ChatDetail />}
    </div>
  );
};

export default ConversationView;
