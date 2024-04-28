import Chat from "../models/chat.model.js";

const chatSocket = (socket, connectedUsers) => {
  socket.on("typing start", async (chatId) => {
    let currentChat = await Chat.findById(chatId)
      .select("users")
      .populate("users")
      .lean();
    if (currentChat && currentChat.users) {
      currentChat.users.forEach((user) => {
        if (user._id.toString() === socket.authInfo._id.toString()) {
          return;
        }
        connectedUsers[user._id]?.emit("typing start", currentChat);
      });
    }
  });

  socket.on("typing stop", async (chatId) => {
    let currentChat = await Chat.findById(chatId)
      .select("users")
      .populate("users");
    if (currentChat && currentChat.users) {
      currentChat.users.forEach((user) => {
        if (user._id.toString() === socket.authInfo._id.toString()) return;

        connectedUsers[user._id]?.emit("typing stop", currentChat);
      });
    }
  });

  socket.on("delete chat", async (deletedChat) => {
    deletedChat?.users.forEach((user) => {
      if (user === socket.authInfo._id.toString()) return;
      connectedUsers[user]?.emit("delete chat", deletedChat);
    });
  });
};

export default chatSocket;
