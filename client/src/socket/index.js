import io from "socket.io-client";

const setupSocket = (token, setSocketIsConnected) => {
  let socket;
  //localhost:8080
  // import.meta.env.VITE_SERVER_URL
  http: socket = io("http://localhost:8080", { query: { token } });
  socket.emit("online");
  socket.on("connect", () => {
    setSocketIsConnected(true);
    console.log("Socket.io connect successfully");
  });

  return socket;
};

export default setupSocket;
