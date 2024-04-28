import { useContext, useEffect, useState } from "react";
// Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
// Icons
import { EllipsisVertical } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { ChatContext } from "@/context/chat-provider";
// Utils
import {
  getChatDisplayInfo,
  isGroupAdmin,
  isMyFavoriteChat,
} from "@/utils/chat-functionality";
// Lib hooks
import { useSelector } from "react-redux";
// Handler
import ToggleFavorite from "@/handler/toggle-favorite";
import LeaveGroup from "@/handler/leave-group";

const ConversationHeader = () => {
  const {
    setCurrentChat,
    currentChat,
    isCurrentChatDetailOpen,
    setIsCurrentChatDetailOpen,
    isTyping,
    onlineUsers,
    conversationContainerRef,
  } = useContext(ChatContext);
  const loggedUserId = useSelector((state) => state.auth.authInfo._id);
  const [onlineMembers, setOnlineMembersId] = useState([]);

  const handleCloseChat = () => {
    setCurrentChat(null);
  };
  useEffect(() => {
    if (!currentChat.isGroupChat) return;
    // Detect Online Members group
    const _onlineMembers = currentChat.users.map((m) => {
      return onlineUsers.filter((itm) => itm === m._id);
    });
    setOnlineMembersId(_onlineMembers.flat());
  }, [currentChat, onlineUsers]);

  const handleGoToFirstMessage = () => {
    conversationContainerRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`${
        isCurrentChatDetailOpen
          ? "top-[80px] pb-0 cursror-default bg-transparent dark:bg-transparent transition"
          : "top-0 bg-white/60 dark:bg-black/60 "
      } 
       absolute left-0 right-0 px-3 backdrop-blur-3xl py-4 w-full h-[64px] z-[30] transition-bg-none`}
    >
      <div className="w-full h-full flex justify-between items-center">
        {/* left */}
        <div
          className={"flex items-center gap-2 flex-1 cursor-pointer transition"}
          onClick={() => setIsCurrentChatDetailOpen(true)}
        >
          {/* Chat Close action */}
          {!isCurrentChatDetailOpen && (
            <span
              className="px-1 md:hidden cursor-pointer"
              onClick={handleCloseChat}
            >
              {<FaArrowLeft className="text-lg" />}
            </span>
          )}
          <Avatar
            className={
              isCurrentChatDetailOpen
                ? "size-[70px] md:size-[80px] "
                : "size-[45px] md:size-[55px] "
            }
          >
            <AvatarFallback>
              {currentChat.isGroupChat
                ? currentChat.chatName[0]
                : getChatDisplayInfo(currentChat, loggedUserId).fullName[0]}
            </AvatarFallback>
            <AvatarImage
              src={
                currentChat.isGroupChat
                  ? ""
                  : import.meta.env.VITE_PROFILE_URL +
                    getChatDisplayInfo(currentChat, loggedUserId)?.avatar?.url
              }
            />
          </Avatar>

          <div className="flex items-center gap-2">
            {currentChat.isGroupChat ? (
              <div className="flex flex-col">
                <h4
                  className={`text-sm md:text-md leading-none ${
                    isCurrentChatDetailOpen ? "line-clamp-3" : "line-clamp-1"
                  }`}
                >
                  {currentChat.chatName}
                </h4>
                {isTyping ? (
                  <h4 className="text-xs font-thin leading-none">typing...</h4>
                ) : (
                  <h4 className="text-xs font-thin leading-none">
                    {currentChat?.users.length} members, online
                    <span> </span> {onlineMembers.length}
                  </h4>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                <h4 className="text-sm md:text-md leading-none">
                  {getChatDisplayInfo(currentChat, loggedUserId).fullName}
                </h4>
                {isTyping ? (
                  <h4 className="text-sm font-thin leading-none">
                    {isTyping && "typing..."}
                  </h4>
                ) : (
                  onlineUsers.includes(
                    getChatDisplayInfo(currentChat, loggedUserId)._id
                  ) && (
                    <h4 className="text-sm font-normal leading-none text-blue-500">
                      Active now
                    </h4>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        {!isCurrentChatDetailOpen && (
          <div className="items-center flex gap-4">
            <ToggleFavorite chatId={currentChat._id} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <EllipsisVertical className="text-[25px] cursor-pointer hover:scale-110 transition" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={handleGoToFirstMessage}>
                  Go to first message
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ToggleFavorite
                    chatId={currentChat._id}
                    title={
                      isMyFavoriteChat(currentChat, loggedUserId)
                        ? "Remove from favorite"
                        : "Add to favorite"
                    }
                  />
                </DropdownMenuItem>
                {currentChat?.isGroupChat && (
                  <>
                    <DropdownMenuItem>Add member</DropdownMenuItem>
                    {isGroupAdmin(currentChat, loggedUserId) ? (
                      <DropdownMenuItem className="text-red-400">
                        Delete this group
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-red-400">
                        <LeaveGroup title={"Leave group"} />
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHeader;

const GroupChatView = () => {};
