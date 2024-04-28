import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";

const auth = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;
  token ??= req?.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(404);
    throw new Error("Please Login First!");
  }

  try {
    const decoded = jwt.verify(token, process.env._JWT_SECRETKEY);
    delete decoded.iat;
    delete decoded.exp;

    try {
      const authInfo = await User.findById(decoded.authId).select(
        "-contacts -favorite"
      );

      if (!authInfo) {
        res
          .status(404)
          .clearCookie("token")
          .json({ message: "Account not found please signup!" });
        return;
      }

      req.authInfo = authInfo;
      next();
    } catch (error) {
      console.log("Error in jwt middleware", error.message);
    }
  } catch (error) {
    res
      .status(500)
      .clearCookie("token")
      .json({ message: "Somthing went wrong please try agian later" });
  }
});

export default auth;
