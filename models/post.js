// post model and schema

// imports
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// has
// - caption (string)
// - media (image or video)
// - user (id)
// - likes (array of user ids)
// - comments (array of comment objects)
// - tags (array of strings)
// - mentions (array of usernames)

// schema
const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
    },
    media: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// export
module.exports = mongoose.model("Post", postSchema);
