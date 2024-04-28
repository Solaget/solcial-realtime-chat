import { Router } from "express";
import auth from "../middleware/auth.js";
import { profileUpload } from "../middleware/multer.js";
import profileController from "../controller/profile.controller.js";

const router = Router();

router.patch("/email", auth, profileController.updateEmail);
router.patch("/bio", auth, profileController.updateBio);
router.patch("/fullName", auth, profileController.updateFullname);
router.patch(
  "/avatar",
  auth,
  profileUpload.single("avatar"),
  profileController.updateAvatar
);
router.delete("/avatar", auth, profileController.removeAvatar);

const profileRouter = router;
export default profileRouter;
