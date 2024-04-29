import io from "socket.io-client";

const setupSocket = (token, setSocketIsConnected) => {
  let socket;
  socket = io(import.meta.env.VITE_SERVER_URL, { query: { token } });
  socket.emit("online");
  socket.on("connect", () => {
    setSocketIsConnected(true);
    // console.log("Socket.io connect successfully");
  });

  return socket;
};

export default setupSocket;
