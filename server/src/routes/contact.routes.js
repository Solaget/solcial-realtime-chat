import { Router } from "express";
import authGuard from "../middleware/auth.js";
import contactController from "../controller/contact.controller.js";

const router = Router();

router.get("/", authGuard, contactController.getContacts);

router.post("/add", authGuard, contactController.addNewContact);

router.delete("/remove", authGuard, contactController.removeContact);

const contactRoutes = router;
export default contactRoutes;
