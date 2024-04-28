import { Router } from "express";
import auth from "../middleware/auth.js";
import usersController from "../controller/users.controller.js";

const router = Router();

router.get("/search", auth, usersController.searchUser);

const usersRouter = router;
export default usersRouter;
