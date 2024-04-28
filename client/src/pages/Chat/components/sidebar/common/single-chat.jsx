import { useContext } from "react";
// Components
import UserStatus from "@/components/common/user-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Icons
import { GoStarFill } from "react-icons/go";
import { MdGroups } from "react-icons/md";
// Context
import { ChatContext } from "@/context/chat-provider";
// Lib hooks
import { useSelector } from "react-redux";
// Utils
import { getChatDisplayInfo } from "@/utils/chat-functionality";
import { timeFormatter } from "@/utils/time-formatter";
import { isMyFavoriteChat } from "@/utils/chat-functionality";

const SingleChat = ({ data: chat }) => {
  const loggedUserId = useSelector((state) => state.auth.authInfo._id);
  const {
    setCurrentChat,
    currentChat,
    setIsCurrentChatDetailOpen,
    onlineUsers,
  } = useContext(ChatContext);
  const displayChatInfo = getChatDisplayInfo(chat, loggedUserId);

  const handleAccessChat = () => {
    setCurrentChat(chat);
    setIsCurrentChatDetailOpen(false);
  };

  return (
    <li
      className={
        currentChat && currentChat._id === chat._id
          ? "w-full px-4 border-solid border-2 border-t-0 border-l-0 border-r-0 border-b-[transparent] border-primary bg-muted sticky top-0 z-50 transition "
          : "w-full px-4 border-solid border-2 border-t-0 border-l-0 border-r-0 border-[#ffffff25] bg-white dark:bg-black"
      }
    >
      {currentChat && currentChat._id === chat._id && (
        <span className="w-[5px] rounded-r-lg rounded-l-none bg-primary h-full absolute left-0 transition chat-focus-indicator" />
      )}
      <div
        className={` w-full min-h-[85px] flex items-center gap-2 py-2 px-2 cursor-pointer hover:opacity-80 transition `}
        onClick={handleAccessChat}
      >
        {/* Group Chat view */}
        {!chat.isGroupChat ? (
          <>
            <UserStatus
              status={
                onlineUsers.includes(displayChatInfo._id) ? "online" : "offline"
              }
            >
              <Avatar className="size-[60px] online">
                <AvatarFallback>{displayChatInfo.fullName[0]}</AvatarFallback>
                <AvatarImage
                  src={
                    import.meta.env.VITE_PROFILE_URL +
                    displayChatInfo?.avatar?.url
                  }
                />
              </Avatar>
            </UserStatus>

            <div className="flex-1 flex gap-2">
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-1">
                  {isMyFavoriteChat(chat, loggedUserId) && (
                    <GoStarFill className="text-sm text-primary" />
                  )}
                  <h3 className="line-clamp-1">{displayChatInfo.fullName}</h3>
                </div>
                {chat?.latestMessage ? (
                  <>
                    {chat.latestMessage.media &&
                      (chat?.latestMessage.media.type === "image" ? (
                        <h3 className="text-xs opacity-70">Voice Message</h3>
                      ) : (
                        <div className="flex gap-1 items-center">
                          <img
                            src={
                              import.meta.env.VITE_MESSAGE_MEDIA_URL +
                              chat?.latestMessage?.media?.url
                            }
                            className="max-h-[25px] max-w-[35px] mt-1"
                          />
                        </div>
                      ))}

                    {chat.latestMessage.content && (
                      <span className="text-xs text-muted-foreground leading-none line-clamp-2">
                        {chat.latestMessage.content}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground leading-none line-clamp-2">
                    No message yet!
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 items-end">
                <span className="text-xs size-[17px] grid place-content-center bg-primary rounded-full text-white ">
                  {chat.messages.length}
                </span>

                <h2 className="text-xs opacity-75">
                  {timeFormatter(
                    chat?.latestMessage && chat.latestMessage.createdAt
                  )}
                </h2>
              </div>
            </div>
          </>
        ) : (
          // Private Chat view
          <>
            <Avatar className="size-[60px]">
              <AvatarFallback>{chat.chatName[0]}</AvatarFallback>
              <AvatarImage
                src={import.meta.env.VITE_PROFILE_URL + chat?.avatar?.url}
              />
            </Avatar>

            <div className="flex-1 flex gap-2">
              <div className="flex flex-col flex-1">
                <div className="flex gap-2 items-center ">
                  {isMyFavoriteChat(chat, loggedUserId) && (
                    <GoStarFill className="text-sm text-primary" />
                  )}
                  <h3 className="line-clamp-1 leadnig-none">
                    {chat?.chatName}
                  </h3>
                </div>

                <span className="text-xs text-muted-foreground leading-none line-clamp-2">
                  {chat?.latestMessage
                    ? chat?.latestMessage.sender._id === loggedUserId
                      ? "You" + ": " + chat?.latestMessage.content
                      : chat?.latestMessage.sender.fullName +
                        ": " +
                        chat?.latestMessage.content
                    : "No message yet!"}
                </span>
              </div>

              <div className="flex flex-col gap-3 items-center">
                <span className="text-xs size-[17px] grid place-content-center bg-primary rounded-full text-white ">
                  {chat.messages.length}
                </span>
                <MdGroups className="" />
              </div>
            </div>
          </>
        )}
      </div>
    </li>
  );
};
export default SingleChat;
