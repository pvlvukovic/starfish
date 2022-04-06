// post controller

// imports
const express = require("express");
const router = express.Router();
const authService = require("../services/auth");
const userService = require("../services/user");
const postService = require("../services/post");
const authMiddleware = require("../middlewares/auth");
const uploadMiddleware = require("../middlewares/upload");
const postValidator = require("../validators/post");
const s3 = require("../utils/s3");

// router has
// GET /posts
// GET /posts/:id
// PUT /posts/:id
// DELETE /posts/:id

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

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("media"),
  postValidator.create,
  async (req, res) => {
    try {
      // get media from req.file
      const media = req.file;

      // if media is not null, attach media to req.body
      if (media) {
        // upload media to s3
        const uploaded = await s3(media);

        req.body.media = uploaded.Location;
      }

      // get user from req.user and attach _id to req.body
      req.body.user = req.user._id;

      // create post
      const post = await postService.createPost(req.body);

      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
router.put("/:id", authMiddleware, postValidator.update, async (req, res) => {
  try {
    // get post from req.params.id
    const post = await postService.getPostById(req.params.id);

    // check if post exists
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
      // check if user is the owner of the post
    } else if (post.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      // update post
      const updatedPost = await postService.updatePost(req.params.id, req.body);

      res.status(200).json(updatedPost);
    }
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
    // get post from req.params.id
    const post = await postService.getPostById(req.params.id);

    // check if post exists
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
      // check if user is the owner of the post
    } else if (post.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      // delete post
      await postService.deletePost(req.params.id);

      res.status(200).json({
        message: "Post deleted",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   POST api/posts/:id/comments
// @desc    Add comment to post
// @access  Private
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    // get post from req.params.id
    const post = await postService.getPostById(req.params.id);

    // check if post exists
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // create comment
    // TODO
    const comment = await postService.createComment(req.params.id, req.body);

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// @route   DELETE api/posts/:id/comments/:commentId
// @desc    Delete comment from post
// @access  Private
router.delete("/:id/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    // get post from req.params.id
    const post = await postService.getPostById(req.params.id);

    // check if post exists
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // get comment from req.params.commentId
    const comment = await postService.getCommentById(req.params.commentId);

    // check if comment exists
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // check if user is the owner of the comment
    if (comment.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // delete comment
    await postService.deleteComment(req.params.commentId);

    res.status(200).json({
      message: "Comment deleted",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// export
module.exports = router;
