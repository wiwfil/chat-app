const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Request = require("../models/request");
const generateToken = require("../config/generateToken");

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [{ name: { $regex: req.query.search, $options: "i" } }],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(users);
});

const onlyFriends = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [{ name: { $regex: req.query.search, $options: "i" } }],
      }
    : {};

  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
    contacts: { $in: [req.user._id] },
  });

  res.send(users);
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      contacts: user.contacts,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      contacts: user.contacts,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const fetchRequests = asyncHandler(async (req, res) => {
  try {
    const requests = await Request.find({
      recipient: { $elemMatch: { $eq: req.user._id } },
    });

    res.status(200).send(requests);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, pic } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { name: name, pic: pic },
      { new: true }
    );
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      contacts: user.contacts,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  allUsers,
  registerUser,
  authUser,
  fetchRequests,
  onlyFriends,
  updateUser,
};
