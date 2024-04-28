import { useState, useContext, useEffect } from "react";
// Componenets
import MyMessage from "./common/my-message";
import OtherMessage from "./common/other-message";
import { Button } from "@/components/ui/button";
// Icons
import { Loader2 } from "lucide-react";
import { AiOutlineArrowDown } from "react-icons/ai";
// Context
import { ChatContext } from "@/context/chat-provider";
import { useSelector } from "react-redux";
// Utils
import { isMyMessage } from "@/utils/chat-functionality";
// Socket
import { socket } from "@/App";

const ConversationContainer = () => {
  const [bottomReached, setBottomReached] = useState(false);
  const {
    conversationContainerRef,
    messages,
    setMessageInputValue,
    messagesIsLoading,
    currentChat,
    selectedChatId,
  } = useContext(ChatContext);
  const loggedUserId = useSelector((state) => state.auth.authInfo._id);

  useEffect(() => {
    const container = conversationContainerRef.current;
    const handleScroll = () => {
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight - 200) {
          setBottomReached(true);
        } else {
          setBottomReached(false);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [conversationContainerRef.current]);

  const scrollToBottom = () => {
    conversationContainerRef.current.scrollTo({
      top: conversationContainerRef.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  // Add Date In Messages/Classify messages by date
  const groupMessagesByDate = () => {
    const groupedMessages = {};
    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
      if (!groupedMessages[messageDate]) {
        groupedMessages[messageDate] = [];
      }
      groupedMessages[messageDate].push(message);
    });
    return groupedMessages;
  };

  const renderMessages = () => {
    const groupedMessages = groupMessagesByDate();
    return Object.entries(groupedMessages).map(([date, msgs]) => (
      <div key={date} className="relative flex flex-col gap-4">
        <h2 className="text-center text-xs">{date}</h2>
        {msgs.map((msg, idx) =>
          msg?.type !== "message" ? (
            <div className="flex justify-center w-full " key={msg._id}>
              <div className="font-thin py-1 px-4 rounded-md bg-black/50 backdrop-blur-sm text-white text-sm leading-snug">
                <h3>{msg?.content}</h3>
              </div>
            </div>
          ) : isMyMessage(msg?.sender._id, loggedUserId) ? (
            <MyMessage message={msg} key={msg._id} />
          ) : (
            <OtherMessage message={msg} key={msg._id} i={idx} />
          )
        )}
      </div>
    ));
  };

  return (
    <div
      ref={conversationContainerRef}
      className="px-3 pt-[75px] pb-2 flex-1 overflow-y-scroll rounded-xl flex z-[10]"
    >
      {messagesIsLoading ? (
        <div className="grid place-content-center w-full h-full ">
          <span className="animate-spin">
            <Loader2 />
          </span>
        </div>
      ) : messages?.length > 0 ? (
        <div className="relative w-full h-fit flex flex-col gap-4">
          {!bottomReached && (
            <Button
              className="fixed right-4 bottom-20 z-50"
              size="icon"
              variant="ghost"
              onClick={scrollToBottom}
            >
              <AiOutlineArrowDown className="text-xl" />
            </Button>
          )}
          {renderMessages()}
        </div>
      ) : (
        <div className="w-full flex-1 flex items-center justify-center ">
          <div className="w-[200px] aspect-square rounded-lg text-white bg-slate-600 py-4 flex flex-col items-center">
            <h3 className="text-sm">No message here yet...</h3>
            <p className="text-sm text-center leading-tight mt-1 font-thin">
              Send a message or tap the greeting below
            </p>
            <h3
              className="text-4xl mt-2 cursor-pointer hover:scale-[110%] transition"
              onClick={() => {
                setMessageInputValue("👋🏼");
              }}
            >
              👋🏼
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationContainer;
