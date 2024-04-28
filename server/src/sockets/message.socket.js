import Chat from "../models/chat.model.js";

const messageSocket = (socket, connectedUsers) => {
  socket.on("send message", async (newMessage) => {
    if (!newMessage) {
      return;
    }
    let currentChat = await Chat.findById(newMessage.chat)
      .select("users")
      .populate("users");

    if (currentChat && currentChat.users) {
      currentChat?.users?.forEach((user) => {
        if (user._id == newMessage.sender._id) {
          return;
        }
        connectedUsers[user._id]?.emit("recieve message", newMessage);
      });
    }
  });

  socket.on("message delete", async (deletedMessage) => {
    if (!deletedMessage) return;
    const chatId = deletedMessage.chat;
    let currentChat = await Chat.findById(chatId)
      .select("users")
      .populate("users");

    if (currentChat && currentChat.users) {
      currentChat?.users?.forEach((user) => {
        if (user._id === socket.authInfo._id) return;
        connectedUsers[user._id]?.emit("message delete", deletedMessage);
      });
    }
  });
};

export default messageSocket;
