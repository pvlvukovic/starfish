// user validation

// imports
const User = require("../models/user");
const { Validated, check } = require("./index");

// update
exports.update = async (req, res, next) => {
  // validate username
  const username = new Validated(req.body.username, "username");
  // username.isRequired();
  // await username.isUnique(User);
  username.min(6);
  username.max(20);
  username.hasNoSpecial();

  // combine errors into one object
  const errors = {
    username: username.error,
  };

  // check for errors
  check(errors, req, res, next);
};

// password
exports.password = async (req, res, next) => {
  // validate old password
  const oldPassword = new Validated(req.body.oldPassword, "oldPassword");
  oldPassword.isRequired();

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
    oldPassword: oldPassword.error,
    password: password.error,
    passwordConfirm: passwordConfirm.error,
  };

  // check for errors
  check(errors, req, res, next);
};

// reset
exports.reset = async (req, res, next) => {
  // validate old password
  const oldPassword = new Validated(req.body.oldPassword, "oldPassword");
  oldPassword.isRequired();

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
    oldPassword: oldPassword.error,
    password: password.error,
    passwordConfirm: passwordConfirm.error,
  };

  // check for errors
  check(errors, req, res, next);
};
