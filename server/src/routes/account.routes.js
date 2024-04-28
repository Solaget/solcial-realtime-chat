import { Router } from "express";
import auth from "../middleware/auth.js";
import accountController from "../controller/account.controller.js";

const router = Router();

router.get("/me", auth, accountController.currentAccount);
router.patch("/privacy/password", auth, accountController.changePassword);
router.delete("/deleteAccount", auth, accountController.deleteAccount);

const accountRouter = router;
export default accountRouter;