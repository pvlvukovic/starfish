// user controller

// imports
const express = require("express");
const router = express.Router();
const authService = require("../services/auth");
const userService = require("../services/user");
const authMiddleware = require("../middlewares/auth");
const uploadMiddleware = require("../middlewares/upload");

// router has
// POST /users
// GET /users
// GET /users/:id
// PUT /users/:id
// DELETE /users/:id
// GET /users/me
// PUT /users/:id/password

// @route   POST api/users
// @desc    Register user
// @access  Private
router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  async (req, res) => {
    try {
      // get avatar from req.file
      const avatar = req.file;

      // if avatar is not null, attach avatar to req.body
      if (avatar) {
        req.body.avatar = avatar.location;
      }

      const verificationToken = authService.generateVerificationToken();
      const user = await userService.createUser({
        ...req.body,
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
  }
);

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   GET api/users/:id
// @desc    Get user by id
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   PUT api/users/:id
// @desc    Update user by id
// @access  Private
router.put(
  "/:id",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  async (req, res) => {
    try {
      // if deleteAvatar is true, delete avatar
      if (req.body.deleteAvatar) {
        await userService.deleteAvatar(req.params.id);
      }

      // get avatar from req.file
      const avatar = req.file;

      // if avatar is not null, atach avatar to req.body and delete previous avatar
      if (avatar) {
        req.body.avatar = avatar.path;
        await userService.deleteAvatar(req.params.id);
      }

      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({
        user,
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

// @route   DELETE api/users/:id
// @desc    Delete user by id
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // delete avatar
    await userService.deleteAvatar(req.params.id);
    const user = await userService.deleteUser(req.params.id);
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   PUT api/users/:id/password
// @desc    Update user password
// @access  Private
router.put("/:id/password", authMiddleware, async (req, res) => {
  try {
    const user = await userService.updatePassword(req.params.id, req.body);
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
