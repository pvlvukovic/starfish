// post validation

// imports
const { Validated, check } = require("./index");
const Post = require("../models/post");

// create
exports.create = async (req, res, next) => {
  // validate caption
  const caption = new Validated(req.body.caption, "caption");
  caption.max(200);

  // combine errors into one object
  const errors = {
    caption: caption.error,
  };

  // check for errors
  check(errors, req, res, next);
};

// update
exports.update = async (req, res, next) => {
  // validate caption
  const caption = new Validated(req.body.caption, "caption");
  caption.max(200);

  // combine errors into one object
  const errors = {
    caption: caption.error,
  };

  // check for errors
  check(errors, req, res, next);
};
