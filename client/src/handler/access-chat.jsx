import { useContext } from "react";
// Api 👇🏼
import { useAccessChatMutation } from "@/api/services/chat.service";
// Context 👇🏼
import { ChatContext } from "@/context/chat-provider";

const AccessChat = ({ children, className, onClick, userId }) => {
  const { setCurrentChat, setIsCurrentChatDetailOpen } =
    useContext(ChatContext);

  const [_accessChat, {}] = useAccessChatMutation();
  const accessChat = async () => {
    const res = await _accessChat(userId).unwrap();
    setCurrentChat(res);
    setIsCurrentChatDetailOpen(false);
    onClick();
  };

  return (
    <div onClick={() => accessChat()} className={className}>
      {children}
    </div>
  );
};

export default AccessChat;
