import { useContext } from "react";
// Components
import { Button } from "@/components/ui/button";
import EditGroupProfile from "./common/edit-group-profile";
// Icons
import { AiOutlineArrowLeft } from "react-icons/ai";
// Context
import { ChatContext } from "@/context/chat-provider";
// Hooks
import { useDispatch, useSelector } from "react-redux";
// Utile
import { isGroupAdmin, isGroupOwner } from "@/utils/chat-functionality";
// Handler
import LeaveGroup from "@/handler/leave-group";
// Api
import { useDeleteGroupMutation } from "@/api/services/chat.service";
import api from "@/api";
// Socket
import { socket } from "@/App";

const Header = () => {
  const { setIsCurrentChatDetailOpen, currentChat, setCurrentChat } =
    useContext(ChatContext);
  const dispatch = useDispatch();
  const hideCurrentChatDetail = () => {
    setIsCurrentChatDetailOpen(false);
  };
  const loggedUserId = useSelector((state) => state.auth.authInfo._id);
  const [deleteGroup, {}] = useDeleteGroupMutation();

  const handleDeleteGroup = async () => {
    try {
      const res = await deleteGroup({ chatId: currentChat._id }).unwrap();
      socket && socket.emit("delete chat", res.data);
      setCurrentChat(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="w-full flex justify-between h-[110px] z-[20]">
      <span className="cursor-pointer" onClick={hideCurrentChatDetail}>
        <AiOutlineArrowLeft className="text-xl" />
      </span>

      <span>
        {!currentChat.isGroupChat ? (
          "Private"
        ) : isGroupAdmin(currentChat, loggedUserId) ? (
          <div className="flex items-center gap-2">
            {isGroupOwner(currentChat, loggedUserId) && (
              <Button variant="ghost" onClick={handleDeleteGroup}>
                Delete group
              </Button>
            )}
            <EditGroupProfile />
          </div>
        ) : (
          <LeaveGroup />
        )}
      </span>
    </header>
  );
};

export default Header;
