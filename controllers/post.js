// post controller

// imports
const express = require("express");
const router = express.Router();
const postService = require("../services/post");
const authMiddleware = require("../middlewares/auth");
const uploadMiddleware = require("../middlewares/upload");

// router has
// POST /posts
// GET /posts
// GET /posts/:id
// PUT /posts/:id
// DELETE /posts/:id
// GET /posts/me

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("media"),
  async (req, res) => {
    try {
      // get media from req.file
      const media = req.file;

      // if media is not null, attach media to req.body
      if (media) {
        req.body.media = media.path;
      }

      const post = await postService.createPost(req.body);
      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await postService.getAllPosts(req.query);
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   GET api/posts/me
// @desc    Get posts by user id
// @access  Private
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const posts = await postService.getPostsByUserId(req.user.id, req.query);
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // get media from req.file
    const media = req.file;

    // if media is not null, attach media to req.body
    if (media) {
      req.body.media = media.path;
    }

    const post = await postService.updatePost(req.params.id, req.body);
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await postService.deletePost(req.params.id);
    res.status(200).json({
      message: "Post deleted",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// exports
module.exports = router;
