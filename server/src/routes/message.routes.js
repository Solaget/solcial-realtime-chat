import { Router } from "express";
import auth from "../middleware/auth.js";
import messageController from "../controller/message.controller.js";
import messageMiddleware from "../middleware/message-middleware.js";
import { messageUpload } from "../middleware/multer.js";

const router = Router();

router.post(
  "/sendMessage",
  auth,
  messageMiddleware,
  messageController.sendMessage
);
router.get("/chatMessages/:chatId", auth, messageController.getAllChatMessages);
router.delete("/deleteMessage", auth, messageController.deleteSingleMessage);

const messageRoutes = router;
export default messageRoutes;
