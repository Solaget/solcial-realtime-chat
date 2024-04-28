import { useEffect, useContext } from "react";
import { ChatContext, selectedChatId } from "@/context/chat-provider";
import { useDispatch } from "react-redux";
import api from "@/api";

const useSocketEvents = (socket, isSocketConnected) => {
  const dispatch = useDispatch();
  const {
    setOnlineUsers,
    messages,
    setIsTyping,
    setMessages,
    currentChat,
    setCurrentChat,
    setIsCurrentChatDetailOpen,
  } = useContext(ChatContext);

  useEffect(() => {
    if (!isSocketConnected) return;

    // Handle New Message from Socket 👇🏼
    socket.on("recieve message", async (incomeMsg) => {
      dispatch(api.util.invalidateTags(["FetchAllChats"]));
      if (!currentChat) return;
      if (selectedChatId === incomeMsg.chat._id) {
        setMessages([...messages, incomeMsg]);
      }
    });

    // Handle When typing and stop typing from socket 👇🏼
    if (!currentChat) return;
    socket.on("typing start", (chat) => {
      if (chat._id === selectedChatId) {
        setIsTyping(true);
      }
    });

    socket.on("typing stop", () => {
      setIsTyping(false);
    });

    socket.on("message delete", (deletedMessage) => {
      dispatch(api.util.invalidateTags(["FetchAllChats"]));
      if (!currentChat) return;
      if (selectedChatId === deletedMessage.chat) {
        setMessages((prev) => {
          const filterdMessages = prev.filter((m) => {
            return m._id !== deletedMessage._id;
          });
          return filterdMessages;
        });
      }
    });
  }, [socket, messages]);

  useEffect(() => {
    if (!isSocketConnected) return;
    // Handle All online users from socket 👇🏼
    socket.on("online users", (_onlineUsers) => {
      setOnlineUsers(_onlineUsers);
    });

    socket.on("delete chat", (deletedChat) => {
      dispatch(api.util.invalidateTags(["FetchAllChats"]));
      if (deletedChat._id === selectedChatId) {
        setCurrentChat(null);
        setIsCurrentChatDetailOpen(false);
      }
    });
  });
};

export default useSocketEvents;
