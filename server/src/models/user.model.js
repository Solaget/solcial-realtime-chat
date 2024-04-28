import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: "Fullname is required",
    },
    email: {
      type: String,
      required: true,
    },
    favorite: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    avatar: {
      url: {
        type: String,
        default: "",
      },
      fallback: {
        type: String,
        enum: ["one", "two", "three", "four"],
      },
    },
    online: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: "Password is required",
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const avatarFallbacks = ["one", "two", "three", "four"];
  const random = Math.floor(Math.random() * avatarFallbacks.length);

  this.avatar.fallback = avatarFallbacks.at(
    random ? random : avatarFallbacks[0]
  );
  console.log("After CREATE");
  next();
});

const User = model("User", userSchema);
export default User;

{
  /*
  status: [
      {
        typee: String,
        enum: ["online", "offline", "recently"],
        default: "online",
      },
    ],
*/
}
