// user controller

// imports
const express = require("express");
const router = express.Router();
const authService = require("../services/auth");
const userService = require("../services/user");
const authMiddleware = require("../middlewares/auth");
const uploadMiddleware = require("../middlewares/upload");
const userValidator = require("../validators/user");
const s3 = require("../utils/s3");

// router has
// GET /users
// GET /users/:id
// PUT /users/:id
// DELETE /users/:id
// PUT /users/:id/password

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.status(200).json(user);
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

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   PATCH api/users/password
// @desc    Reset user password
// @access  Private
router.patch(
  "/password",
  authMiddleware,
  userValidator.changePassword,
  async (req, res) => {
    try {
      const user = await userService.changePassword(
        req.user.id,
        req.body.password,
        req.body.oldPassword
      );
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

// @route   PUT api/users/:id
// @desc    Update user by id
// @access  Private
router.put(
  "/:id",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  userValidator.update,
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
        // upload avatar to s3
        const uploaded = await s3(avatar);

        req.body.avatar = uploaded.Location;
      }

      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json(user);
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
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// exports
module.exports = router;
