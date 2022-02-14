// imports
const mongoose = require("mongoose");

// post has
// media, can be image or video
// caption, text
// likes, array of user ids
// comments, array of comments
// user, user id
// tags, array of tags
// mentions, array of user ids

// schema
const postSchema = new mongoose.Schema(
  {
    media: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [
      {
        type: String,
      },
    ],
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// export
module.exports = mongoose.model("Post", postSchema);
