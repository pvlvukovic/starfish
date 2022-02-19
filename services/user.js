// user service

// imports
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authService = require("./auth");

// create
exports.createUser = async (user) => {
  try {
    const newUser = await User.create(user);
    return newUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

// get by id
exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// get by email
exports.getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// get all
exports.getAllUsers = async (query) => {
  // pagination
  const { page, limit } = query;
  const pageNumber = page ? parseInt(page) : 1;
  const limitNumber = limit ? parseInt(limit) : 10;
  const offset = (pageNumber - 1) * limitNumber;

  // sort
  const { sort, order } = query;
  const sortBy = sort ? sort : "createdAt";
  const sortOrder = order ? order : "desc";

  // search by username
  const { search } = query;
  const searchQuery = search
    ? { username: { $regex: search, $options: "i" } }
    : {};

  try {
    const users = await User.find(searchQuery)
      .skip(offset)
      .limit(limitNumber)
      .sort({ [sortBy]: sortOrder });
    return users;
  } catch (err) {
    throw new Error(err.message);
  }
};

// update
exports.updateUser = async (userId, user) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
    });
    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

// delete
exports.deleteUser = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    return deletedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

// verify
exports.verifyUser = async (email, verificationToken) => {
  try {
    const user = await User.findOne({ email, verificationToken });
    user.verified = true;
    await user.save();
    // generate auth token
    const token = authService.generateAuthToken(user._id);
    return { user, token };
  } catch (err) {
    throw new Error(err.message);
  }
};

// delete avatar
exports.deleteAvatar = async (userId) => {
  try {
    // TODO delete avatar from storage
    const user = await User.findById(userId);
    user.avatar = null;
    await user.save();
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// change password
exports.changePassword = async (userId, password) => {
  try {
    const user = await User.findById(userId);
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};
