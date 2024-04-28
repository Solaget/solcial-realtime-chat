import React, {
  createContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
// Importing Socket 👇🏼
import { socket } from "@/App";
// Importing Api 👇🏼
import { useFetchChatsQuery } from "@/api/services/chat.service";
import { useLazyFetchChatMessagesQuery } from "@/api/services/message.service";
// Export ChatContext 👇🏼
export const ChatContext = createContext();
// Variable for current chat id 👇🏼
export let selectedChatId;

const ChatContextProvider = ({ children }) => {
  // Initializ All States for chat 👇🏼
  const conversationContainerRef = useRef(null);
  const [message, setMessage] = useState({});
  const [messageInputValue, setMessageInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [isCurrentChatDetailOpen, setIsCurrentChatDetailOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [toReplyMessage, setToReplyMessage] = useState(null);

  // Fetch Current Chat messages 👇🏼
  const [fetchCurrentChatMessages, { isLoading: messagesIsLoading, isError }] =
    useLazyFetchChatMessagesQuery();
  useLayoutEffect(() => {
    setMessageInputValue("");
    if (!currentChat) {
      selectedChatId = null;
      return;
    }
    if (toReplyMessage) {
      setToReplyMessage(null);
    }
    selectedChatId = currentChat._id;

    // Fetching Current Chat Messages 👇🏼
    fetchCurrentChatMessages(selectedChatId)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {});
  }, [currentChat]);

  useEffect(() => {
    if (!conversationContainerRef.current) return;
    conversationContainerRef.current.scrollTop =
      conversationContainerRef.current.scrollHeight;
  }, [currentChat, messages]);
  return (
    <ChatContext.Provider
      // Exporting all states for child components 👇🏼
      value={{
        chats,
        setChats,
        fetchCurrentChatMessages,
        onlineUsers,
        setOnlineUsers,
        message,
        messages,
        isTyping,
        setIsTyping,
        setMessage,
        setMessages,
        messagesIsLoading,
        currentChat,
        setCurrentChat,
        messageInputValue,
        setMessageInputValue,
        isCurrentChatDetailOpen,
        setIsCurrentChatDetailOpen,
        conversationContainerRef,
        selectedChatId,
        toReplyMessage,
        setToReplyMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export default ChatContextProvider;
