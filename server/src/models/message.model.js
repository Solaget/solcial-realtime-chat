import { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    content: {
      type: String,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    repliedMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    status: {
      type: String,
      enum: ["sent"],
      default: "sent",
    },
    media: {
      url: { type: String },
      size: {
        type: String,
      },
      type: {
        type: String,
        enum: ["image", "video", "audio"],
      },
    },
    type: {
      type: String,
      enum: ["message", "join", "leave", "add", "remove", "update"],
      default: "message",
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);
export default Message;
