import { Router } from "express";
import authRouter from "./auth.routes.js";
import accountRouter from "./account.routes.js";
import chatRouter from "./chat.routes.js";
import profileRouter from "./profile.routes.js";
import usersRouter from "./users.routes.js";
import messageRoutes from "./message.routes.js";
import contactRoutes from "./contact.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("server is running");
});

router.use("/auth", authRouter);
router.use("/account", accountRouter);
router.use("/profile", profileRouter);
router.use("/chat", chatRouter);
router.use("/users", usersRouter);
router.use("/message", messageRoutes);
router.use("/contacts", contactRoutes);

const rootRouter = router;
export default rootRouter;
