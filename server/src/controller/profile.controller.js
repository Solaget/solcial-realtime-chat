import User from "../models/user.model.js";
import fs from "fs/promises";
import { existsSync } from "fs";
import asyncHandler from "express-async-handler";
import { emailSchema } from "../validator/validator.js";

// + access by = Account owner;
// + endpoint = patch/profile/email
// + protected-route 🔒
const updateEmail = asyncHandler(async (req, res) => {
  const { email: newEmail } = req.body;
  const authId = req.authInfo._id;
  const oldEmail = req.authInfo.email;

  const { error } = emailSchema.validate({ email: newEmail });
  if (error) {
    res.status(400).json({
      status: "error",
      message: error.details[0].message.replace(/"/g, ""),
    });
    return;
  }

  if (oldEmail === newEmail) {
    res.status(400);
    throw new Error("Please make change");
  }

  const isEmailTaken = await User.findOne({ email: newEmail });
  if (isEmailTaken) {
    res.status(409);
    throw new Error("Email is already taken");
  }

  const updatedDoc = await User.findByIdAndUpdate(authId, {
    $set: { email: newEmail },
  });
  res.json({
    status: "success",
    message: "Email updated successfully",
    updatedDoc,
  });
});

// + access by = Users;
// + endpoint = patch/profile/bio
// + protected-route 🔒
const updateBio = asyncHandler(async (req, res) => {
  const bio = req.body.bio ?? "";
  const authId = req.authInfo._id;

  await User?.findByIdAndUpdate(authId, { $set: { bio } });
  res.json({ message: "Bio Updated Successfull" });
});

// + access by = Users;
// + endpoint = patch/profile/fullName
// + protected-route 🔒
const updateFullname = asyncHandler(async (req, res) => {
  const { fullName: newFullname } = req.body;
  const authId = req.authInfo._id;
  const oldFullname = req.authInfo.fullName;

  if (!newFullname) {
    res.status(400);
    throw new Error("Email is required");
  }

  if (oldFullname === newFullname) {
    res.status(400);
    throw new Error("Please make change");
  }

  const updatedDoc = await User.findByIdAndUpdate(authId, {
    $set: { fullName: newFullname },
  });
  res.json({ status: "success", message: "Fullname updated successfully" });
});

// + access by = Users;
// + endpoint = patch/profile/Avatar
// + protected-route 🔒
const updateAvatar = async (req, res) => {
  const newAvatar = req.file.filename;
  const authId = req.authInfo._id;
  const oldAvatar = req.authInfo.avatar.url;

  if (oldAvatar) {
    if (existsSync(`./public/uploads/profile/${oldAvatar}`)) {
      await fs.unlink(`./public/uploads/profile/${oldAvatar}`);
    }
  }

  const doc = await User.findByIdAndUpdate(authId, {
    $set: { "avatar.url": newAvatar },
  });

  res.json({
    status: "success",
    message: "Profile Picture Change Successfull",
  });
};

// + access by = Users;
// + endpoint = delete/profile/avatar
// + protected-route 🔒
const removeAvatar = async (req, res) => {
  const authId = req.authInfo._id;
  const avatarUrl = req.authInfo.avatar.url;

  if (avatarUrl) {
    if (existsSync(`./public/uploads/profile/${avatarUrl}`)) {
      await fs.unlink(`./public/uploads/profile/${avatarUrl}`);
    }
    await User.findByIdAndUpdate(authId, {
      $set: { "avatar.url": "" },
    });

    res.json({
      status: "success",
      message: "Profile Picture Removed Successfull",
    });
  }
};

const profileController = {
  updateAvatar,
  updateEmail,
  updateBio,
  removeAvatar,
  updateFullname,
};

export default profileController;
