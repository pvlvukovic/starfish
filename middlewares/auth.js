// auth middleware

// imports
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// check if user is logged in and attach user to req.user
const auth = async (req, res, next) => {
  try {
    // get bearer token from authorization header
    const token = req.header("Authorization").replace("Bearer ", "");

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user from database
    const user = await User.findOne({ _id: decoded._id });

    // attach user to req.user
    req.user = user;

    // call next middleware
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

// export auth middleware
module.exports = auth;
