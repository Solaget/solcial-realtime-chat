import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

// + access by = Users;
// + endpoint = get/users/search?q=
// + protected-route 🔒
const searchUser = asyncHandler(async (req, res) => {
  const query = req.query.q;
  if (query === "" || query === " " || query.length === 0) {
    res.json([]);
    return;
  }
  const searchResult = await User.find({
    $or: [
      { fullName: { $regex: query.toLowerCase(), $options: "i" } },
      { email: { $regex: query.toLowerCase(), $options: "i" } },
    ],
    _id: { $ne: req.authInfo._id },
  });
  res.json(searchResult);
});

const usersController = { searchUser };
export default usersController;
