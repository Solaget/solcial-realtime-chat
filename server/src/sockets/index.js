import { Server as socketIO } from "socket.io";
import chatSocket from "./chat.socket.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import messageSocket from "./message.socket.js";

export let socket;

let connectedUsers = {};
const onlineUsers = new Set();

const socketSetup = (server) => {
  const io = new socketIO(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    pingTimeout: 60000,
  });

  // Middleware for auth
  io.use(async (socket, next) => {
    const { token } = socket.handshake.query;
    const _JWT_SECRETKEY = process.env._JWT_SECRETKEY;
    if (!token) {
      return;
    }
    try {
      const { authId } = jwt.verify(token, _JWT_SECRETKEY);
      const authInfo = await User.findById(authId);
      if (!authInfo) return;
      socket.authInfo = authInfo;
      next();
    } catch (error) {
      console.log(error.message);
    }
  });

  io.on("connection", async (socket) => {
    const authId = socket.authInfo._id;
    connectedUsers[authId] = socket;
    await User.findByIdAndUpdate(authId, { $set: { online: true } });

    socket.on("online", () => {
      let onlineUsersId = Object.keys(connectedUsers);
      io.emit("online users", onlineUsersId);
    });
    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(authId, { $set: { online: false } });

      let onlineUsersId = Object.keys(connectedUsers);
      io.emit("online users", onlineUsersId);

      delete connectedUsers[authId];
      socket.authInfo = null;
    });

    // Initialize socket all modules 👇🏼
    chatSocket(socket, connectedUsers, io);
    messageSocket(socket, connectedUsers, io);
  });
};

export default socketSetup;
