import React, { Suspense, useContext, useRef } from "react";
// Components
import { Button } from "@/components/ui/button";
import FileSelector from "./common/file-selector";
import VoiceRecorder from "./common/voice-recorder";
import EmojiPickerBox from "./common/emoji-picker";
// Icons
import { SendHorizonal } from "lucide-react";
import { VscReply } from "react-icons/vsc";
import { MdOutlineClose } from "react-icons/md";
// Api
import { useSendMessageMutation } from "@/api/services/message.service";
//Custom Hooks
import { useToast } from "@/hooks/use-toast";
// Context
import { ChatContext } from "@/context/chat-provider";
// Socket
import { socket } from "@/App";

const ConversationFooter = () => {
  const { toast } = useToast();
  const {
    messageInputValue,
    setMessageInputValue,
    setMessages,
    messages,
    currentChat,
    conversationContainerRef,
    setToReplyMessage,
    toReplyMessage,
  } = useContext(ChatContext);
  const [sendMessage] = useSendMessageMutation();
  const typingTimeout = useRef(null);

  const handleMessageInputChage = (e) => {
    const value = e.target.value;
    setMessageInputValue(value);
  };

  const handleSendMessage = async () => {
    if (messageInputValue.length == 0) return;
    let payload = {
      content: messageInputValue,
      chatId: currentChat._id,
    };

    if (toReplyMessage) {
      payload.repliedMessage = toReplyMessage._id;
    }

    try {
      const data = await sendMessage(payload).unwrap();
      setMessageInputValue("");
      setToReplyMessage(null);
      socket && socket.emit("send message", data);
      setMessages([...messages, data]);

      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    } catch (error) {
      toast({
        title: "Error",
        description: "Try again later",
      });
    }
  };

  const handleKeyDown = () => {
    if (!socket) return;
    socket.emit("typing start", currentChat._id);
  };
  const handleKeyUp = () => {
    if (!socket) return;
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing stop", currentChat._id);
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col z-10">
      {toReplyMessage && (
        <div className="h-[50px] flex items-center justify-between pl-4 py-2 bg-black border-b border-b-primary ">
          <div className="flex items-center gap-2">
            <VscReply className="text-xl" />
          </div>
          {/* Reply message */}
          <div className="flex-1 flex gap-2 items-center px-2">
            {toReplyMessage.media &&
              (toReplyMessage.media.type === "image" ? (
                <img
                  className="max-w-[30px] max-h-[30px]"
                  src={
                    import.meta.env.VITE_MESSAGE_MEDIA_URL +
                    toReplyMessage.media.url
                  }
                />
              ) : (
                <h3 className="text-sm">Audio</h3>
              ))}

            {toReplyMessage.content && (
              <h3 className="text-sm leading-tight line-clamp-2">
                {toReplyMessage.content}
              </h3>
            )}
          </div>

          <Button variant="ghost" onClick={() => setToReplyMessage(null)}>
            <MdOutlineClose className="text-xl" />
          </Button>
        </div>
      )}

      <div className="flex bg-background h-[60px]">
        <div className="flex gap-1 items-center pl-3 pr-2">
          <EmojiPickerBox setMessageInputValue={setMessageInputValue} />
        </div>

        <input
          type="text"
          className="text-md px-2 w-full h-full flex-1 bg-transparent outline-none border-none"
          placeholder="Write somthing..."
          onChange={handleMessageInputChage}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          value={messageInputValue}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        {/* Tabs */}
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 items-center px-2">
            {messageInputValue.length < 1 && (
              <>
                <FileSelector />
                <VoiceRecorder />
              </>
            )}
          </div>

          {messageInputValue.length >= 1 && (
            <h3
              onClick={handleSendMessage}
              className="h-full pl-0  pr-3 flex items-center justify-center bg-[transparent] cursor-pointer"
            >
              <SendHorizonal />
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationFooter;
