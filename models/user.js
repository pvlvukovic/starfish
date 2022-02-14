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
      type: String,
      unique: true,
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
  return bcrypt.compare(password, this.password);
};

// hash password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// export
module.exports = mongoose.model("User", userSchema);
