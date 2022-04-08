// post service

// imports
// post model
const Post = require("../models/post");
// comment model
const Comment = require("../models/comment");

// get all
exports.getAllPosts = async (query) => {
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
    ? {
        caption: {
          $regex: search,
          $options: "i",
        },
      }
    : {};

  // get total
  const total = await Post.countDocuments(searchQuery);

  // init pagination object
  const pagination = {
    page: pageNumber,
    limit: limitNumber,
    total,
    pages: Math.ceil(total / limitNumber),
    prev: pageNumber !== 1 ? pageNumber - 1 : null,
    next: pageNumber !== Math.ceil(total / limitNumber) ? pageNumber + 1 : null,
  };

  // get posts
  const posts = await Post.find(searchQuery)
    .sort({ [sortBy]: sortOrder })
    .skip(offset)
    .limit(limitNumber)
    .populate("user", {
      username: 1,
      email: 1,
      avatar: 1,
    });

  return {
    posts,
    pagination,
  };
};

// create
exports.createPost = async (data) => {
  // create post
  const post = new Post({
    caption: data.caption,
    media: data.media,
    user: data.user,
  });

  // save post
  await post.save();

  return post;
};

// update
exports.updatePost = async (_id, data) => {
  // update post
  const post = await Post.findOneAndUpdate(
    { _id },
    {
      caption: data.caption,
    },
    { new: true }
  );

  return post;
};

// get by id
exports.getPostById = async (_id) => {
  // get post
  const post = await Post.findOne({ _id })
    .populate("user", {
      username: 1,
      email: 1,
      avatar: 1,
    })
    .populate("comments.user", {
      username: 1,
      email: 1,
      avatar: 1,
    });

  return post;
};

// delete
exports.deletePost = async (_id) => {
  // delete post
  const post = await Post.findOneAndDelete({ _id });

  // delete comments
  await Comment.deleteMany({ post: post._id });

  return post;
};

// get comments
exports.getComments = async (_id) => {
  // get comments
  const comments = await Comment.find({ post: _id })
    .populate("user", {
      username: 1,
      email: 1,
      avatar: 1,
    })
    .sort({ createdAt: "desc" });

  return comments;
};

// create comment
exports.createComment = async (data) => {
  // create comment
  const comment = new Comment({
    text: data.text,
    user: data.user,
    post: data.post,
  });

  // save comment
  await comment.save();

  return comment;
};

// delete comment
exports.deleteComment = async (_id) => {
  // delete comment
  const comment = await Comment.findOneAndDelete({ _id });

  return comment;
};

// get post by user
exports.getPostsByUserId = async (userId) => {
  // get posts
  const posts = await Post.find({ user: userId })
    .populate("user", {
      username: 1,
      email: 1,
      avatar: 1,
    })
    .sort({ createdAt: "desc" });

  return posts;
};
