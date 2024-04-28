import { useContext } from "react";
import { timeFormatter } from "@/utils/time-formatter";
// Components
import AudioPlayer from "@/components/common/audio-player";
// Icons
import { VscReply } from "react-icons/vsc";
import { CiFileOn } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
// Context
import { ChatContext } from "@/context/chat-provider";
// Api
import { useDeleteSingleMessageMutation } from "@/api/services/message.service";
// Socket
import { socket } from "@/App";

const MyMessage = ({ message }) => {
  const { toReplyMessage, setToReplyMessage, setMessages } =
    useContext(ChatContext);

  let hint_timeout;
  const handleScrollToRepliedMessage = (repliedMsgId) => {
    const messageElement = document.getElementById(`${repliedMsgId}`);
    clearTimeout(hint_timeout);

    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
      messageElement.classList.add("replied-msg-hint");

      hint_timeout = setTimeout(() => {
        if (messageElement.classList.contains("replied-msg-hint")) {
          messageElement.classList.remove("replied-msg-hint");
        }
      }, 3000);
    }
  };

  const handleSelectReplyMessage = () => {
    setToReplyMessage(message);
  };

  const [deleteMessage, { isLoading: isMessageDeleting }] =
    useDeleteSingleMessageMutation();
  const handleDeleteSingleMessage = async (messageId) => {
    const { deletedMessage } = await deleteMessage({
      messageId,
    }).unwrap();
    setMessages((prev) => {
      let filterdMessages = prev.filter((m) => {
        return m._id !== deletedMessage._id;
      });

      return filterdMessages;
    });
    socket.emit("message delete", deletedMessage);
  };
  return (
    <div
      className="single-message flex justify-end gap-2 items-end group"
      id={`${message._id}`}
    >
      <div className="animate-to-right flex-col items-center gap-2 hidden group-hover:flex">
        {!isMessageDeleting && (
          <span
            className="cursor-pointer"
            onClick={() => handleDeleteSingleMessage(message._id)}
          >
            <AiOutlineDelete className="text-md hover:text-red-500 transition" />
          </span>
        )}
        <span className="cursor-pointer" onClick={handleSelectReplyMessage}>
          <VscReply className="text-sm" />
        </span>
      </div>

      <div className="z-10 flex flex-col gap-1 max-w-[80%] py-1 pl-1 pr-1 bg-primary text-primary-foreground rounded-lg rounded-br-none text-sm leading-snug ">
        {message.repliedMessage && (
          <div
            id={message.repliedMessage._id}
            onClick={() =>
              handleScrollToRepliedMessage(message.repliedMessage._id)
            }
            className="relative flex flex-col gap-1 overflow-hidden px-4 py-1 bg-white/60 hover:bg-white/100 hover:scale-[.95] transition text-black w-full rounded leading-tight line-clamp-1 cursor-pointer"
          >
            <span className="text-[10px] opacity-70 leading-none">
              {message.repliedMessage.sender.fullName}
            </span>
            <div className="flex items-center gap-2">
              {message?.repliedMessage.media && <CiFileOn />}
              {message.repliedMessage.content && (
                <h3 className="line-clamp-1 leading-none">
                  {message?.repliedMessage.content}
                </h3>
              )}
            </div>
            <span className="absolute h-full w-[5px] bg-white dark:bg-black left-0 top-0 bottom-0" />
          </div>
        )}
        <div>
          {message?.media &&
            (message?.media.type === "audio" ? (
              <AudioPlayer
                size={message.media?.size || 0}
                src={
                  import.meta.env.VITE_MESSAGE_MEDIA_URL + message.media?.url
                }
              />
            ) : (
              <div className="relative max-h-[280px] sm:max-h-[360px] min-h-[100px] min-w-fit max-w-[100%]">
                <span className="absolute right-2 top-2 text-xs bg-black/40 backdrop-blur-sm rounded-full px-2">
                  {message.media?.size}
                </span>
                <img
                  src={
                    import.meta.env.VITE_MESSAGE_MEDIA_URL + message.media?.url
                  }
                  className="max-h-[270px] sm:max-h-[350px] max-w-[100%] object-cover rounded "
                  alt=""
                  loading="lazy"
                />
              </div>
            ))}
          {message.content && <h3>{message?.content}</h3>}
          <div className={` flex justify-end gap-1 items-center`}>
            {message.status === "sent" && <h3 className="text-[10px]">Sent</h3>}
            <h4 className="text-[10px] opacity-65 leading-none">
              {timeFormatter(message.createdAt)}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMessage;
