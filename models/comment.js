// comment model and schema

// imports
const mongoose = require("mongoose");

// has
// - text (string)
// - user (id)
// - likes (array of user ids)

// schema
const commentSchema = new mongoose.Schema(
  {
    text: {
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
  },
  {
    timestamps: true,
  }
);

// export
module.exports = mongoose.model("Comment", commentSchema);
