import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { socket } from "../sockets/index.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { signupSchema } from "../validator/validator.js";

// + access by = any;
// + endpoint = post/auth/signup
// + public-route 🔓
const signup = asyncHandler(async (req, res, next) => {
  const { email, fullName, password } = req.body;
  const { error } = signupSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }

  const emailIsExist = await User.exists({ email });
  if (emailIsExist) {
    res.status(400);
    throw new Error("User by this email already exist");
  }

  const hashedPassword = bcrypt.hashSync(password);
  const newUser = await User.create({
    email,
    fullName,
    password: hashedPassword,
  });

  if (!newUser) {
    res.status(500);
    throw new Error("Failed to create your account please try again later");
  }

  const _JWT_SECRETKEY = process.env._JWT_SECRETKEY;
  const payload = { authId: newUser._id };
  const token = generateToken(payload);

  // / Send Token To Client Brwoser using Cookies 👇🏼
  res
    .cookie("token", token, {
      maxAge: "86400000",
      sameSite: "None",
      secure: true,
    })
    .json({ message: "Register Successfull", token });
});

// + access by = any;
// + endpoint = post/auth/login
// + public-route 🔓
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All input should be valid");
  }

  const userDoc = await User.findOne({ email }, "+password");
  if (!userDoc) {
    res.status(400);
    throw new Error("Email or Password are incorrect");
  }

  const hashedPassword = userDoc.password;
  const isPasswordOk = bcrypt.compareSync(password, hashedPassword);

  if (!isPasswordOk) {
    res.status(400);
    throw new Error("Email or Password are incorrect");
  }

  const payload = { authId: userDoc._id };
  const token = generateToken(payload);

  // Send Token To Client Brwoser using Cookies 👇🏼
  res
    .cookie("token", token, {
      maxAge: "86400000",
      sameSite: "None",
      secure: true,
    })
    .json({ message: "Login Successfull", token });
  console.log("Login Success");
});

// + access by = Logged user;
// + endpoint = post/auth/logout
// + protected-route 🔒
const logout = async (req, res) => {
  const authId = req.authInfo;
  await User.findByIdAndUpdate(authId, { $set: { online: false } });
  res.clearCookie("token").json({
    message: "Login Successfull",
  });
};

const authController = { login, signup, logout };
export default authController;
