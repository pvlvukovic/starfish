// imports
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: Number,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// compare password
userSchema.methods.comparePassword = function (password) {
  console.log(password, this.password);
  let isMatch = bcrypt.compareSync(password, this.password);
  return isMatch;
};

// export
module.exports = mongoose.model("User", userSchema);
