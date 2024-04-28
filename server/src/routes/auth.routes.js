import { Router } from "express";
import authController from "../controller/auth.controller.js";
import authGuard from "../middleware/auth.js";

const router = Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.delete("/logout", authGuard, authController.logout);

const authRouter = router;
export default authRouter;
