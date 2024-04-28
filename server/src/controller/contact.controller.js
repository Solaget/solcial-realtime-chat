import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

// + access by = Users;
// + endpoint = get/contacts
// + protected-route 🔒
const getContacts = asyncHandler(async (req, res) => {
  const authId = req.authInfo._id;
  const allUserContacts = await User.findById(authId)
    .select("contacts")
    .populate({
      path: "contacts",
      select: "fullName avatar email",
    });
  res.json(allUserContacts.contacts);
});

// + access by = Users;
// + endpoint = post/contacts/add
// + protected-route 🔒
const addNewContact = asyncHandler(async (req, res) => {
  const authId = req.authInfo._id;
  const userEmail = req.body.userEmail;

  if (userEmail === req.authInfo.email) {
    res.status(400);
    throw new Error("You can't add yourself");
  }

  if (!userEmail) {
    res.status(400);
    throw new Error("User Email is required");
  }

  const userDoc = await User.findOne({ email: userEmail });
  if (!userDoc) {
    res.status(404);
    throw new Error("User not found by this email");
  }

  const authDoc = await User.findById(authId).select("contacts");
  if (authDoc.contacts.includes(userDoc._id)) {
    res.status(400);
    throw new Error("This is user aleardy is saved in your contact before");
  }

  await User.findByIdAndUpdate(
    authId,
    {
      $push: { contacts: userDoc._id },
    },
    { new: true }
  );
  res.json({ message: "User added to your contact" });
});

// + access by = Users;
// + endpoint = delete/contacts/remove
// + protected-route 🔒
const removeContact = asyncHandler(async (req, res) => {
  const authId = req.authInfo._id;
  const userEmail = req.body.userEmail;

  if (!userEmail) {
    res.status(400);
    throw new Error("User Email is required");
  }

  const userDoc = await User.findOne({ email: userEmail });
  if (!userDoc) {
    res.status(404);
    throw new Error("User not found by this email");
  }

  const authDoc = await User.findById(authId).select("contacts");
  if (!authDoc.contacts.includes(userDoc._id)) {
    res.status(400);
    throw new Error("This user is not in your contact");
  }

  await User.findByIdAndUpdate(authId, {
    $pull: { contacts: userDoc._id },
  });
  res.json({ message: "User Removed Successfully from contact" });
});

const contactController = { getContacts, addNewContact, removeContact };
export default contactController;
