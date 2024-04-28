import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import { existsSync } from "fs";
import { passwordSchema } from "../validator/validator.js";


// + access by = Account Owner;
// + endpoint = get/account/me
// + protected-route
const currentAccount = asyncHandler(async (req, res, next) => {
  const authInfo = req.authInfo;
  res.json(authInfo);
});

// + access by = Account Owner;
// + endpoint = patch/account/privacy/password
// + protected-route
const changePassword = asyncHandler(async (req, res, next) => {
  const authInfo = req.authInfo;

  if (!req.body.oldPassword) {
    res.status(400).json({ message: "Old password is required!" });
    return;
  }

  const { error } = passwordSchema.validate({ password: req.body.newPassword });
  if (error) {
    res.status(400).json({
      status: "error",
      message: `new ${error.details[0].message.replace(/"/g, "")}`,
    });
    return;
  }

  const oldPassword = await User.findById(authInfo._id, "password");

  const passisValid = bcrypt.compareSync(
    req.body.oldPassword,
    oldPassword.password
  );

  if (!passisValid) {
    res.status(400).json({ message: "Old password is incorrect" });
    return;
  }

  const isSamePass = bcrypt.compareSync(
    req.body.newPassword,
    oldPassword.password
  );

  if (isSamePass) {
    res.status(400).json({
      message:
        "Your new password is same to your old password please make change on your new password",
    });
    return;
  }

  const hashPass = bcrypt.hashSync(req.body.newPassword);
  await User.findByIdAndUpdate(authInfo._id, { $set: { password: hashPass } });
  res.json({ status: "success", message: "Password Change Successull" });
});

// + access by = Account Owner;
// + endpoint = delete/account/deleteAccount
// + protected-route
const deleteAccount = asyncHandler(async (req, res, next) => {
  const authId = req.authInfo._id;
  const confrimPassword = req.body.confrimPassword;
  const userDoc = await User.findById(authId, "password");

  if (!confrimPassword) {
    res.status(400);
    throw new Error("Please confirm your password");
  }

  const isPassValid = bcrypt.compareSync(confrimPassword, userDoc.password);
  if (!isPassValid) {
    res.status(400);
    throw new Error("Wrong password!");
  }
  // Remove all user private chats;
  await Chat.deleteMany({
    isGroupChat: false,
    users: { $elemMatch: { $eq: authId } },
  });

  // Delete Group if user have group and if user are owner
  await Chat.deleteMany({
    isGroupChat: true,
    owner: { $eq: authId },
  });

  // Delete User Messages
  await Message.deleteMany({ sender: authId });

  // Remove Self from others group
  await Chat.updateMany(
    {
      isGroupChat: true,
      users: { $elemMatch: { $eq: authId } },
    },
    { $pull: { users: authId } }
  );

  let avatarUrl = req.authInfo.avatar || "noavatar";
  const isAvatarExist = existsSync(`./public/uploads/${avatarUrl}`);

  // Remove User avatar if user have avatar
  isAvatarExist && (await fs.unlink(`./public/uploads/${avatarUrl}`));
  // Delete user Account
  await User.findByIdAndDelete(authId);
  res
    .clearCookie("token")
    .json({ message: "Account removed Successfully", status: "success" });
});

const accountController = { currentAccount, changePassword, deleteAccount };
export default accountController;
