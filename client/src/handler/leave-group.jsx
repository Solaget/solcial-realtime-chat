import { useContext } from "react";
// Context 👇🏼
import { ChatContext } from "@/context/chat-provider";
// Components 👇🏼
import { Button } from "@/components/ui/button";
// Api 👇🏼
import { useLeaveGroupChatMutation } from "@/api/services/chat.service";
import { useSendMessageMutation } from "@/api/services/message.service";
// Socket.io 👇🏼
import { socket } from "@/App";
// Lib 👇🏼
import { useSelector } from "react-redux";

const LeaveGroup = ({ title }) => {
  // State from chat context 👇🏼
  const { refetchChats, setCurrentChat, currentChat, setMessageInputValue } =
    useContext(ChatContext);

  // Api hooks initial 👇🏼
  const [sendMessage] = useSendMessageMutation();
  const [leaveGroupChat, { isLoading: isGroupLeaving }] =
    useLeaveGroupChatMutation();

  // Redux states 👇🏼
  const authInfo = useSelector((state) => state.auth.authInfo);

  // Handle Leave Group 👇🏼
  const handleLeaveGroup = async () => {
    try {
      setCurrentChat(null);
      const res = await sendMessage({
        content: authInfo.fullName + " " + "Leaved this group",
        chatId: currentChat._id,
        type: "leave",
      });
      await leaveGroupChat(currentChat._id);
      await refetchChats();
      socket.emit("send message", res.data);
      setMessageInputValue("");
    } catch (error) {
      console.log(error);
    }
  };
  return isGroupLeaving ? (
    "Loading..."
  ) : (
    <div onClick={handleLeaveGroup}>
      {title ?? (
        <Button disabled={isGroupLeaving} variant="ghost" className="py-1">
          Leave Group
        </Button>
      )}
    </div>
  );
};

export default LeaveGroup;
