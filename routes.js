// router

// imports
const express = require("express");
const router = express.Router();
const authController = require("./controllers/auth");
const userController = require("./controllers/user");
const postController = require("./controllers/post");

router.use("/auth", authController);
router.use("/users", userController);
router.use("/posts", postController);

// exports
module.exports = router;
