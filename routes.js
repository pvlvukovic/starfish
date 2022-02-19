// router

// imports
const express = require("express");
const router = express.Router();
const authController = require("./controllers/auth");
const userController = require("./controllers/user");

router.use("/auth", authController);
router.use("/users", userController);

// exports
module.exports = router;
