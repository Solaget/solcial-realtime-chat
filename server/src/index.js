import express from "express";
import http from "http";
import cors from "cors";
import connectToDB from "./config/db.js";
import rootRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import socketSetup from "./sockets/index.js";
import "dotenv/config.js";
import colors from "colors";
import { errorHandler, notFound } from "./middleware/error.js";


const app = express();
app.use(express.static("public"));
const server = http.createServer(app);
app.use(
  cors({
    origin: "https://solcial-realtime-chat.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Initail our socket.io
socketSetup(server);

// Routes
app.use(rootRouter);
app.use(notFound);
app.use(errorHandler);

// Error Handler
app.use(errorHandler);

const PORT = process.env._PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`.yellow);
  connectToDB();
});
