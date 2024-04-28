import { model, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    chatName: {
      type: String,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    info: {
      type: String,
    },
    favorite: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

chatSchema.pre("save", function (next) {
  if (this.isGroupChat) {
    this.info = "";
  }
  next();
});

const Chat = model("Chat", chatSchema);
export default Chat;
