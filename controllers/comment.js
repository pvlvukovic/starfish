// comment controller

// imports
const express = require("express");
const router = express.Router();
const commentService = require("../services/comment");
const authMiddleware = require("../middlewares/auth");

// router has
// POST post/:postId/comments
// GET post/:postId/comments
// GET post/:postId/comments/:id
// PUT post/:postId/comments/:id
// DELETE post/:postId/comments/:id

// @route   POST api/posts/:postId/comments
// @desc    Create comment
// @access  Private
router.post("/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const comment = await commentService.createComment(
      req.params.postId,
      req.body
    );
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   GET api/posts/:postId/comments
// @desc    Get all comments by post id
// @access  Private
router.get("/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const comments = await commentService.getAllCommentsByPostId(
      req.params.postId
    );
    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   GET api/posts/:postId/comments/:id
// @desc    Get comment by id
// @access  Private
router.get("/:postId/comments/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await commentService.getCommentById(req.params.id);
    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   PUT api/posts/:postId/comments/:id
// @desc    Update comment
// @access  Private
router.put("/:postId/comments/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await commentService.updateComment(req.params.id, req.body);
    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   DELETE api/posts/:postId/comments/:id
// @desc    Delete comment
// @access  Private
router.delete("/:postId/comments/:id", authMiddleware, async (req, res) => {
  try {
    await commentService.deleteComment(req.params.id);
    res.status(204).json();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// exports
module.exports = router;
