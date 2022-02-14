// user controller

// imports
const express = require("express");
const router = express.Router();
const authService = require("../services/auth");
const userService = require("../services/user");

// router has
// POST /users
// GET /users/:id
// PUT /users/:id
// DELETE /users/:id
// GET /users/me

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await userService.createUser({
      username,
      email,
      password,
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

// @route   GET api/users/:id
// @desc    Get user by id
// @access  Private
router.get("/:id", async (req, res) => {
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
router.put("/:id", async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user by id
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
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
router.get("/me", async (req, res) => {
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
}
