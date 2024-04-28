import { useContext } from "react";
// Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AudioPlayer from "@/components/common/audio-player";
//Utils
import { timeFormatter } from "@/utils/time-formatter";
import { isGroupAdmin, isGroupOwner } from "@/utils/chat-functionality";
// Icons
import { VscReply } from "react-icons/vsc";
import { CiFileOn } from "react-icons/ci";
// Context
import { ChatContext } from "@/context/chat-provider";

const OtherMessage = ({ message }) => {
  const { toReplyMessage, setToReplyMessage, currentChat } =
    useContext(ChatContext);
  let hint_timeout;
  const handleScrollToRepliedMessage = (repliedMsgId) => {
    const msgEl = document.getElementById(`${repliedMsgId}`);
    clearTimeout(hint_timeout);

    if (msgEl) {
      msgEl.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
      msgEl.classList.add("replied-msg-hint");

      hint_timeout = setTimeout(() => {
        if (msgEl.classList.contains("replied-msg-hint")) {
          msgEl.classList.remove("replied-msg-hint");
        }
      }, 3000);
    }
  };
  const handleSelectReplyMessage = () => {
    setToReplyMessage(message);
  };
  return (
    <div
      className="flex justify-start items-end gap-2
    "
      id={`${message._id}`}
    >
      {message.chat.isGroupChat && (
        <Avatar className="size=[30px]">
          <AvatarFallback>{message.sender.fullName[0]}</AvatarFallback>
          <AvatarImage
            src={import.meta.env.VITE_PROFILE_URL + message.sender?.avatar.url}
          />
        </Avatar>
      )}

      <div className="relative bg-[whitesmoke] dark:bg-[#030303] text-black dark:text-white max-w-[80%] py-1 pl-1 pr-1 rounded-lg rounded-br-none text-sm leading-snug ">
        {message.repliedMessage && (
          <div
            id={message.repliedMessage._id}
            onClick={() =>
              handleScrollToRepliedMessage(message.repliedMessage._id)
            }
            className="flex flex-col gap-1 relative w-full shadow-xl overflow-hidden px-4 py-1 bg-primary opacity-70  hover:opacity-100 hover:scale-[.95] transition rounded leading-tight line-clamp-1 cursor-pointer"
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
            <span className="absolute h-full w-1 bg-black dark:bg-white left-0 top-0 bottom-0" />
          </div>
        )}

        <div>
          {message?.media &&
            (message?.media.type === "audio" ? (
              <AudioPlayer
                size={message.media?.size}
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
          <h3>{message?.content}</h3>
          <div
            className={`${
              message?.media ? "w-full" : "w-full"
            } flex justify-between gap-2 items-center`}
          >
            <h4 className="text-[10px] opacity-65 leading-none">
              {isGroupAdmin(currentChat, message.sender._id) &&
              !isGroupOwner(currentChat, message.sender._id)
                ? "Admin"
                : "owner"}
            </h4>
            <h4 className="text-[10px] opacity-65 leading-none">
              {timeFormatter(message.createdAt)}
            </h4>
          </div>
        </div>
      </div>
      <span className="cursor-pointer" onClick={handleSelectReplyMessage}>
        <VscReply className="text-sm" />
      </span>
    </div>
  );
};

export default OtherMessage;
