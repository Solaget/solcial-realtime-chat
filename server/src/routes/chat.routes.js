import { Router } from "express";
import auth from "../middleware/auth.js";
import chatController from "../controller/chat.controller.js";

const router = Router();

router.post("/accessChat", auth, chatController.accessChat);
router.get("/fetchChats", auth, chatController.getMyChats);
router.get("/singleChat/:id", auth, chatController.getSingleChat);

router.put("/toggleFavorite", auth, chatController.toggleFavorite);

// Group Endpoints
router.post("/createGroup", auth, chatController.createNewGroupChat);
router.post("/group/addAdmin", auth, chatController.addAdminToGroup);
router.delete("/group/leaveGroup", auth, chatController.leaveGroup);
router.delete("/group/removeUser", auth, chatController.removeUserFromGroup);
router.post("/group/addMember", auth, chatController.addMemberToGroup);
router.put("/group/editProfile", auth, chatController.editGroupProfile);
router.delete("/group/deleteGroup", auth, chatController.deleteGroup);

const chatRouter = router;
export default chatRouter;
