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

  // search by username or email
  const { search } = query;
  const searchQuery = search
    ? {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  // verified filter - must be true
  const verifiedQuery = { verified: true };

  // get total
  let total = 0;
  try {
    total = await User.countDocuments({
      ...searchQuery,
      ...verifiedQuery,
    });
  } catch (err) {
    throw new Error(err.message);
  }

  // init pagination object
  const pagination = {
    page: pageNumber,
    limit: limitNumber,
    total,
    pages: Math.ceil(total / limitNumber),
    prev: pageNumber !== 1 ? pageNumber - 1 : null,
    next: pageNumber !== Math.ceil(total / limitNumber) ? pageNumber + 1 : null,
  };

  // exclude password and verificationToken
  const select = { password: 0, verificationToken: 0 };

  try {
    const users = await User.find({
      ...searchQuery,
      ...verifiedQuery,
    })
      .select(select)
      .skip(offset)
      .limit(limitNumber)
      .sort({ [sortBy]: sortOrder });
    return { users, pagination };
  } catch (err) {
    throw new Error(err.message);
  }
};

// update
exports.updateUser = async (userId, user) => {
  // disable password update
  delete user.password;

  // disable verificationToken update
  delete user.verificationToken;

  // disable email update
  delete user.email;

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

    // if user is not found or verificationToken is not valid
    if (!user || user.verificationToken !== verificationToken) {
      throw new Error("User not found or invalid verification token");
    }

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
exports.changePassword = async (userId, password, oldPassword) => {
  try {
    const user = await User.findById(userId);

    // check old password
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      throw new Error(
        "Old password is not valid. Please enter your old password correctly."
      );
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// reset password
exports.resetPassword = async (userId, password) => {
  try {
    const user = await User.findById(userId);

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return {
      message: "Password has been changed successfully.",
    };
  } catch (err) {
    throw new Error(err.message);
  }
};
