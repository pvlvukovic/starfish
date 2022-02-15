// router

// imports
const express = require("express");
const router = express.Router();
const authController = require("./controllers/auth");
const userController = require("./controllers/user");
const postController = require("./controllers/post");
const commentController = require("./controllers/comment");

router.use("/auth", authController);
router.use("/users", userController);
router.use("/posts/:postId/comments", commentController);
router.use("/posts", postController);

// exports
module.exports = router;
