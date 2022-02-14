// auth service

// imports
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// generate auth token
exports.generateAuthToken = (userId) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET);
  return token;
};

// generate verification token
exports.generateVerificationToken = () => {
  // verification token is unique and random string of 32 characters
  // TODO: use guid
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return token;
};
