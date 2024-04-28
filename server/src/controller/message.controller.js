import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import asyncHandler from "express-async-handler";
import fileSizeConvertor from "../utils/fileSizeConverter.js";


// + access by = Chat Member;
// + endpoint = get/message/sendMessage
// + protected-route 🔒
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, type } = req.body;
  const sender = req.authInfo._id;

  if (!chatId) {
    res.status(400);
    throw new Error("Chat Id is required");
  }

  if (!req.withFile && !content) {
    res.status(400);
    throw new Error("Message content or file required!");
  }

  const chatDoc = await Chat.findById(chatId);
  if (!chatDoc) {
    res.status(404);
    throw new Error("Chat not found");
  }

  const isChatMember = chatDoc.users.includes(sender);
  if (!isChatMember) {
    res.status(400);
    throw new Error("You are not member for this chat");
  }

  let newMessage;
  if (!req.withFile) {
    newMessage = {
      sender,
      content,
      chat: chatId,
      type,
    };
  } else {
    let mimetype = req.file.mimetype.split("/")[0];
    newMessage = {
      sender,
      content,
      chat: chatId,
      media: {
        url: req.file.filename,
        type: mimetype,
        size: fileSizeConvertor(req.file.size),
      },
    };
  }

  let repliedMessage = req.body.repliedMessage;
  if (repliedMessage) {
    newMessage.repliedMessage = repliedMessage;
  }

  try {
    const savedMessage = await Message.create(newMessage);
    const message = await Message.findById(savedMessage)
      .populate("sender")
      .populate("chat")
      .populate({
        path: "repliedMessage",
        populate: {
          path: "sender",
          select: "fullName",
        },
      });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id },
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// + access by = Chat Member;
// + endpoint = get/message/chatMessages/chatId
// + protected-route 🔒
const getAllChatMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  const messages = await Message.find({ chat: chatId })
    .populate("sender")
    .populate("chat")
    .populate({
      path: "repliedMessage",
      populate: {
        path: "sender",
        select: "fullName",
      },
    });
  res.json(messages);
});

// + access by = Message Sender;
// + endpoint = get/message/deleteMessage
// + protected-route 🔒
const deleteSingleMessage = asyncHandler(async (req, res) => {
  const messageId = req.body.messageId;
  const authId = req.authInfo._id;

  const messageDoc = await Message.findOne({ _id: messageId });
  if (!messageDoc) {
    res.status(404);
    throw new Error("Message can't find");
  }

  const isAuthSender = messageDoc.sender.toString() === authId.toString();
  if (!isAuthSender) {
    res.status(400);
    throw new Error("You can't delete this message!");
  }

  const chatDoc = await Chat.findById(messageDoc.chat);

  const isChatLatestMessage =
    chatDoc.latestMessage.toString() === messageId.toString();

  if (isChatLatestMessage) {
    const newChatLatestMessageId =
      chatDoc.messages[chatDoc.messages.length - 2];
    await Chat.findByIdAndUpdate(messageDoc.chat, {
      $set: { latestMessage: newChatLatestMessageId.toString() },
    });
  }

  const deletedMessage = await Message.findByIdAndDelete(messageId);
  await Message.updateMany(
    { repliedMessage: messageId },
    { $unset: { repliedMessage: "" } }
  );
  await Chat.findByIdAndUpdate(messageDoc.chat, {
    $pull: { messages: messageId },
  });

  res.json({ message: "Deleted Successfull", deletedMessage });
});

const messageController = {
  sendMessage,
  getAllChatMessages,
  deleteSingleMessage,
};
export default messageController;
