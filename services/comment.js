// comment service

// imports
const Comment = require("../models/comment");

// create
exports.createComment = async (comment) => {
  try {
    const newComment = await Comment.create(comment);
    return newComment;
  } catch (err) {
    throw new Error(err.message);
  }
};

// get by id
exports.getCommentById = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);
    return comment;
  } catch (err) {
    throw new Error(err.message);
  }
};

// get by post id
exports.getCommentsByPostId = async (postId, query) => {
  try {
    // pagination
    const { page, limit } = query;
    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 10;
    const offset = (pageNumber - 1) * limitNumber;

    // sort
    const { sort, order } = query;
    const sortBy = sort ? sort : "createdAt";
    const sortOrder = order ? order : "desc";

    const comments = await Comment.find({ post: postId })
      .skip(offset)
      .limit(limitNumber)
      .sort({ [sortBy]: sortOrder });

    return comments;
  } catch (err) {
    throw new Error(err.message);
  }
};

// update
exports.updateComment = async (commentId, comment) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, comment, {
      new: true,
    });
    return updatedComment;
  } catch (err) {
    throw new Error(err.message);
  }
};

// delete
exports.deleteComment = async (commentId) => {
  try {
    await Comment.findByIdAndDelete(commentId);
  } catch (err) {
    throw new Error(err.message);
  }
};

// toggle like
exports.toggleLikeComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findById(commentId);

    // check if user already liked
    if (comment.likes.includes(userId)) {
      // unlike
      const index = comment.likes.indexOf(userId);
      comment.likes.splice(index, 1);
    } else {
      // like
      comment.likes.push(userId);
    }

    const updatedComment = await comment.save();
    return updatedComment;
  } catch (err) {
    throw new Error(err.message);
  }
};
