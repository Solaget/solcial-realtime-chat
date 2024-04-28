import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import asyncHandler from "express-async-handler";

// + access by = Users;
// + endpoint = post/chat/accessChat
// + protected-route 🔒
const accessChat = asyncHandler(async (req, res) => {
  const authId = req.authInfo._id;
  const { userId } = req.body;

  let hasChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: authId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users")
    .populate("latestMessage")
    .populate("messages");

  if (hasChat) {
    res.json(hasChat);
    return;
  }

  let chatData = {
    isGroupChat: false,
    users: [authId, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);
    const createdChatDoc = await Chat.findOne({ _id: createdChat._id }).populate(
      "users"
    );
    res.status(200).json(createdChatDoc);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// + access by = Users;
// + endpoint = get/chat/fetchChats
// + protected-route 🔒
const getMyChats = asyncHandler(async (req, res) => {
  try {
    const allMyChats = await Chat.find({
      users: { $elemMatch: { $eq: req.authInfo._id } },
    })
      .populate("users")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "fullName avatar email",
        },
      })
      .sort({ updatedAt: -1 });

    res.json(allMyChats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// + access by = Users;
// + endpoint = get/chat/singleChat/:id
// + protected-route 🔒
const getSingleChat = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const authInfo = req.authInfo;

  const chatDoc = await Chat.findOne({ _id: chatId })
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  res.json(chatDoc);
});

// ### Group Endpoints ### 👇🏼👇🏼;
// + access by = All users;
// + endpoint = post/chat/createGroup
// + protected-route 🔒
const createNewGroupChat = asyncHandler(async (req, res) => {
  const chatName = req.body.chatName;
  const authId = req.authInfo._id;
  const isGroupChat = true;
  const admins = [authId];
  const _users = req?.body?.users ?? [];

  let users = [..._users, authId];

  if (!chatName) {
    res.status(400);
    throw new Error("Group name is required");
  }

  const data = { chatName, admins, users, isGroupChat, owner: authId };
  const createdGpChat = await Chat.create(data);
  const createdGpChatDoc = await Chat.findOne({
    _id: createdGpChat._id,
  }).populate("users");
  res.json(createdGpChatDoc);
});

// + access by = Admins;
// + endpoint = post/chat/group/addAdmin
// + protected-route 🔒
const addAdminToGroup = asyncHandler(async (req, res) => {
  const authId = req.authInfo._id;
  const userIdToBeAdmin = req.body.userId;
  const chatId = req.body.chatId;

  if (!userIdToBeAdmin) {
    res.status(404);
    throw new Error("User is required");
  }
  const chatDoc = await Chat.findById(chatId);
  if (!chatDoc) {
    res.status(404);
    throw new Error("Chat not found!");
  }

  // check if auth is admin;
  const isAuthAdmin = chatDoc.admins.some(
    (a) => a.toString() === authId.toString()
  );
  if (!isAuthAdmin) {
    res.status(400);
    throw new Error("You can't add admin because you are not admin");
  }

  // Check user is admin before;
  const isUserAdminBefore = chatDoc.admins.some(
    (a) => a.toString() === userIdToBeAdmin.toString()
  );

  if (isUserAdminBefore) {
    res.status(400);
    throw new Error("This user is Admin before");
  }

  const updatedChatDoc = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { admins: userIdToBeAdmin },
    },
    { new: true }
  )?.populate("users");
  res.json({ message: "Added Successfully", data: updatedChatDoc });
});

// + access by = All users expect owner;
// + endpoint = delete/chat/group/leaveGroup
// + protected-route 🔒
const leaveGroup = asyncHandler(async (req, res) => {
  const chatId = req.body.chatId;
  const authId = req.authInfo._id;

  const chatDoc = await Chat.findById(chatId);
  if (!chatDoc) {
    res.status(404);
    throw new Error("Chat not found!");
  }

  // Check if user is member of the group before trying to remove user
  const authIsMember = chatDoc.users.includes(authId);
  if (!authIsMember) {
    res.status(400);
    throw new Error("You are not this group member");
  }

  // Check if user is admin if user are admin remove user from admin list
  const authIsAdmin = chatDoc.admins.includes(authId);
  if (authIsAdmin) {
    await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { admins: authId } },
      { new: true }
    );
  }

  const updatedChatDoc = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: authId } },
    { new: true }
  );

  if (!updatedChatDoc) {
    throw new Error("Some Error Occured Please try again later");
  }
  res.json({ message: "Leaved from group successfull" });
});

// + access by = Admins;
// + endpoint = delete/chat/group/removeUser
// + protected-route 🔒
const removeUserFromGroup = asyncHandler(async (req, res) => {
  const chatId = req.body.chatId;
  const authId = req.authInfo._id;
  const userIdToRemove = req.body.userId;

  const chatDoc = await Chat.findById(chatId);
  if (!chatDoc) {
    res.status(404);
    throw new Error("Chat not found!");
  }

  // Check auth is admin before access this endpoint
  const authIsAdmin = chatDoc.admins.includes(authId);
  if (!authIsAdmin) {
    res.status(403);
    throw new Error("You can't access this group!");
  }

  // Check user want to remove is group member
  const userIsThisGroupMember = chatDoc.users.includes(userIdToRemove);
  if (!userIsThisGroupMember) {
    res.status(400);
    throw new Error("User not found to remove");
  }

  const updatedChatDoc = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userIdToRemove } },
    { new: true }
  )?.populate("users");

  if (!updatedChatDoc) {
    throw new Error("Some Error Occured Please try again later");
  }
  res.json({
    message: "User Removed Successfully from group",
    data: updatedChatDoc,
  });
});

// + access by = All users;
// + endpoint = post/chat/group/addMember
// + protected-route 🔒
const addMemberToGroup = asyncHandler(async (req, res) => {
  const authId = req.authInfo._id;
  const { users, chatId } = req.body;

  const chatDoc = await Chat.findById(chatId);
  if (!chatDoc) {
    res.status(404);
    throw new Error("Chat not found!");
  }

  // Check if auth user are member before adding new member
  const isAuthGroupMember = chatDoc.users.includes(authId);
  if (!isAuthGroupMember) {
    res.status(403);
    throw new Error("You can't access this group!");
  }

  const updatedChatDoc = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: users },
    },
    { new: true }
  )?.populate("users");

  if (!updatedChatDoc) {
    throw new Error("Please try agian later");
  }

  res.json({ message: "User Added Successfully", data: updatedChatDoc });
});

// + access by = Owner and Admins;
// + endpoint = put/chat/group/editProfile
// + protected-route 🔒
const editGroupProfile = asyncHandler(async (req, res) => {
  const { info, chatName, chatId } = req.body;
  const authId = req.authInfo._id;

  if (!chatName) {
    res.status(400);
    throw new Error("Chaname is required!");
  }

  const chatDoc = await Chat.findById(chatId);
  if (!chatDoc) {
    res.status(404);
    throw new Error("Chat is not found");
  }

  // Check is req user is admin before access
  const authIsAdmin = chatDoc.admins.includes(authId);
  if (!authIsAdmin) {
    res.status(403);
    throw new Error("You can't access this group!");
  }

  const updatedChatDoc = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: { chatName, info },
    },
    { new: true }
  )?.populate("users");

  if (!updatedChatDoc) {
    throw new Error("Please try again later");
  }

  res.json({
    message: "Group Profile Updated Successfull",
    data: updatedChatDoc,
  });
});

// + access by = All users;
// + endpoint = put/chat/toggleFavorite
// + protected-route 🔒
const toggleFavorite = asyncHandler(async (req, res) => {
  const chatId = req.body.chatId;
  const authId = req.authInfo._id;

  if (!chatId) {
    res.status(400);
    throw new Error("Chat Id is required");
  }
  const chatDoc = await Chat.findById(chatId);
  if (!chatDoc) {
    res.status(404);
    throw new Error("Chat is not found");
  }

  if (!chatDoc.users.includes(authId)) {
    res.status(400);
    throw new Error("You can't add this chat in your favorite!");
  }

  const userDoc = await User.findById(authId);
  if (userDoc.favorite.includes(chatDoc._id)) {
    removeFromFavorite();
  } else {
    addToFavorite();
  }

  async function addToFavorite() {
    await User.findByIdAndUpdate(
      authId,
      { $push: { favorite: chatDoc._id } },
      { new: true }
    );
    const updatedChatDoc = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { favorite: authId } },
      { new: true }
    ).populate("users");
    res.json({ message: "Add to favorite successfull", data: updatedChatDoc });
  }

  async function removeFromFavorite() {
    await User.findByIdAndUpdate(
      authId,
      { $pull: { favorite: chatDoc._id } },
      { new: true }
    );
    const updatedChatDoc = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { favorite: authId } },
      { new: true }
    ).populate("users");

    res.json({
      message: "Remove from favorite successfull",
      data: updatedChatDoc,
    });
  }
});

// + access by = Owner
// + endpoint = delete/chat/group/deleteGroup
// + protected-route 🔒
const deleteGroup = asyncHandler(async (req, res) => {
  const chatId = req.body.chatId;
  const authId = req.authInfo._id;

  if (!chatId) {
    res.status(400);
    throw new Error("Chat Id is required");
  }

  const chatDoc = await Chat.findById(chatId);
  if (!chatDoc) {
    res.status(404);
    throw new Error("Chat is not found");
  }

  if (chatDoc.owner.toString() !== authId.toString()) {
    res.status(400);
    throw new Error("You can't delete this chat because of you're not owner!");
  }
  // Remove all group messages
  await Message.deleteMany({ chat: chatId });

  // Remove from users favorite;
  const deletedData = await Chat.findByIdAndDelete(chatId);
  res.json({ message: "Chat Deleted Successfully", data: deletedData });
});

const chatController = {
  getMyChats,
  getSingleChat,
  accessChat,
  createNewGroupChat,
  addAdminToGroup,
  addMemberToGroup,
  leaveGroup,
  removeUserFromGroup,
  editGroupProfile,
  deleteGroup,
  toggleFavorite,
};
export default chatController;
