// post service

// imports
const Post = require("../models/post");
const commentService = require("./comment");

// create
exports.createPost = async (post) => {
  try {
    const newPost = await Post.create(post);
    return newPost;
  } catch (err) {
    throw new Error(err.message);
  }
};

// get by id
exports.getPostById = async (postId) => {
  try {
    const post = await Post.findById(postId);
    return post;
  } catch (err) {
    throw new Error(err.message);
  }
};

// get by user id
exports.getPostsByUserId = async (userId, query) => {
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

    // search by caption
    const { search } = query;
    const searchQuery = search
      ? { caption: { $regex: search, $options: "i" } }
      : {};

    const posts = await Post.find({
      ...searchQuery,
      user: userId,
    })
      .skip(offset)
      .limit(limitNumber)
      .sort({ [sortBy]: sortOrder });

    return posts;
  } catch (err) {
    throw new Error(err.message);
  }
};

// update
exports.updatePost = async (postId, post) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });
    return updatedPost;
  } catch (err) {
    throw new Error(err.message);
  }
};

// delete
exports.deletePost = async (postId) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);

    // delete comments
    await commentService.deleteCommentsByPostId(postId);

    return deletedPost;
  } catch (err) {
    throw new Error(err.message);
  }
};

// toggle like
exports.toggleLikePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);

    // check if user already liked post
    const userLiked = post.likes.find(
      (like) => like.user.toString() === userId
    );

    // if user already liked post, remove like
    if (userLiked) {
      post.likes = post.likes.filter((like) => like.user.toString() !== userId);
    }
    // if user didn't like post, add like
    else {
      post.likes.push({ user: userId });
    }

    await post.save();
    return post;
  } catch (err) {
    throw new Error(err.message);
  }
};

// get all posts
exports.getAllPosts = async (query) => {
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

    // search by caption
    const { search } = query;
    const searchQuery = search
      ? { caption: { $regex: search, $options: "i" } }
      : {};

    // user
    const { user } = query;
    const userQuery = user ? { user: user } : {};

    const posts = await Post.find({
      ...searchQuery,
      ...userQuery,
    })
      .skip(offset)
      .limit(limitNumber)
      .sort({ [sortBy]: sortOrder });

    return posts;
  } catch (err) {
    throw new Error(err.message);
  }
};
