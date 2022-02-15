// auth controller

// imports
const express = require("express");
const router = express.Router();
const authService = require("../services/auth");
const userService = require("../services/user");

// router has
// POST /auth/login
// POST /auth/register
// POST /auth/verify
// POST /auth/forgot
// POST /auth/reset

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const verificationToken = authService.generateVerificationToken();
    const user = await userService.createUser({
      username,
      email,
      password,
      verificationToken,
    });
    const token = authService.generateAuthToken(user._id);
    res.status(201).json({
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Incorrect password");
    }
    const token = authService.generateAuthToken(user._id);
    res.status(200).json({
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   POST api/auth/verify
// @desc    Verify user
// @access  Public
router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;
    const user = await userService.verifyUser(token);
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   POST api/auth/forgot
// @desc    Forgot password
// @access  Public
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    const token = authService.generateVerificationToken(user._id);
    user.verificationToken = token;
    await user.save();
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   POST api/auth/reset
// @desc    Reset password
// @access  Public
router.post("/reset", async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await userService.getUserByVerificationToken(token);
    user.password = password;

    // generate new verification token
    const newToken = authService.generateVerificationToken(user._id);
    user.verificationToken = newToken;

    await user.save();
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// exports
module.exports = router;
