// auth validation

// imports
const User = require("../models/user");
const { Validated, check } = require("./index");

// login
exports.login = async (req, res, next) => {
  // validate email
  const email = new Validated(req.body.email, "email");
  email.isRequired();
  email.isEmail();

  // validate password
  const password = new Validated(req.body.password, "password");
  password.isRequired();

  // combine errors into one object
  const errors = {
    email: email.error,
    password: password.error,
  };

  // check for errors
  check(errors, req, res, next);
};

// register
exports.register = async (req, res, next) => {
  // validate email
  const email = new Validated(req.body.email, "email");
  await email.isRequired();
  email.isEmail();
  email.isUnique(User);

  // validate username
  const username = new Validated(req.body.username, "username");
  username.isRequired();
  await username.isUnique(User);
  username.min(6);
  username.max(20);
  username.hasNoSpecial();

  // validate password
  const password = new Validated(req.body.password, "password");
  password.isRequired();
  password.min(8);
  password.max(32);
  password.hasUppercase();
  password.hasLowercase();
  password.hasNumber();

  // validate password confirmation
  const passwordConfirm = new Validated(
    req.body.passwordConfirm,
    "passwordConfirm",
    User
  );
  passwordConfirm.isRequired();
  passwordConfirm.isEqual(req.body.password);

  // combine errors into one object
  const errors = {
    email: email.error,
    username: username.error,
    password: password.error,
    passwordConfirm: passwordConfirm.error,
  };

  // check for errors
  check(errors, req, res, next);
};

// verify
exports.verify = async (req, res, next) => {
  // validate email
  const email = new Validated(req.body.email, "email");
  email.isRequired();
  email.isEmail();

  // validate token
  const token = new Validated(req.body.token, "token");
  token.isRequired();
  token.isNumber();
  token.isLength(4);

  // combine errors into one object
  const errors = {
    email: email.error,
    token: token.error,
  };

  // check for errors
  check(errors, req, res, next);
};

// forgot password
exports.forgotPassword = async (req, res, next) => {
  // validate email
  const email = new Validated(req.body.email, "email", User);
  email.isRequired();
  email.isEmail();

  // combine errors into one object
  const errors = {
    email: email.error,
  };

  // check for errors
  check(errors, req, res, next);
};

// reset password
exports.resetPassword = async (req, res, next) => {
  // validate password
  const password = new Validated(req.body.password, "password");
  password.isRequired();
  password.min(8);
  password.max(32);
  password.hasUppercase();
  password.hasLowercase();
  password.hasNumber();

  // validate password confirmation
  const passwordConfirm = new Validated(
    req.body.passwordConfirm,
    "passwordConfirm"
  );
  passwordConfirm.isRequired();
  passwordConfirm.isEqual(req.body.password);

  // combine errors into one object
  const errors = {
    password: password.error,
    passwordConfirm: passwordConfirm.error,
  };

  // check for errors
  check(errors, req, res, next);
};
