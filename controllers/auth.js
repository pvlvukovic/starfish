// auth controller

// imports
const express = require("express");
const router = express.Router();
const authService = require("../services/auth");
const userService = require("../services/user");
const uploadMiddleware = require("../middlewares/upload");
const authMiddleware = require("../middlewares/auth");
const s3 = require("../utils/s3");
const {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/email");
const bcrypt = require("bcrypt");

// router has
// POST /auth/login
// POST /auth/register
// POST /auth/verify
// POST /auth/forgot
// POST /auth/reset

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  uploadMiddleware.single("avatar"),
  async (req, res) => {
    try {
      // get avatar from req.file
      const avatar = req.file;

      // if avatar is not null, attach avatar to req.body
      if (avatar) {
        // upload avatar to s3
        const uploaded = await s3(avatar);

        req.body.avatar = uploaded.Location;
      }

      const verificationToken = authService.generateVerificationToken();

      // hash password
      const password = await bcrypt.hash(req.body.password, 10);

      const user = await userService.createUser({
        ...req.body,
        password,
        verificationToken,
      });
      const token = authService.generateAuthToken(user._id);

      // send verification email
      sendVerificationEmail(user.email, verificationToken);

      res.status(201).json({
        message: "User created successfully",
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    // check if user exists
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    // check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Incorrect password");
    }

    // check if user is verified
    if (!user.verified) {
      return res.status(401).json({
        message: "Please verify your email first",
      });
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
    const { email, token } = req.body;
    const data = await userService.verifyUser(email, token);
    res.status(200).json({
      ...data,
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

    // send password reset email
    await sendPasswordResetEmail(user.email, token);

    res.status(200).json({
      message: "Password reset email sent",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   POST api/auth/reset
// @desc    Reset password
// @access  Private
router.post("/reset", authMiddleware, async (req, res) => {
  // get user from req.user
  const { user } = req;
  console.log(user);

  try {
    // change password
    await userService.changePassword(user, req.body.password);
    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// exports
module.exports = router;
