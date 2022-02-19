// auth service

// imports
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// generate auth token
exports.generateAuthToken = (userId) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET);
  return token;
};

// generate verification token
exports.generateVerificationToken = () => {
  // verificaiton token is a random 4 digit number
  const token = Math.floor(1000 + Math.random() * 9000);
  return token;
};
