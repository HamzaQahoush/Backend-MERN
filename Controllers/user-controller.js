const HttpError = require('../models/http-error');
const uuid = require('uuid');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const getAllUser = (req, res, next) => {
  if (users.length === 0) {
    return next(new HttpError('Could Not find any user', 404));
  }
  res.status(200).json({ users: users });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const param = errors.errors[0].param;
    throw new HttpError(
      `invalid inputs passed for ${param}, please check your input`,
      422
    );
  }
  const { name, email, password } = req.body;

  const hasUser = await User.findOne({ email: email });
  if (hasUser) {
    return next(
      new HttpError('Could Not create user, Email already exist ', 422)
    );
  }
  const addedUser = new User({
    name,
    email,
    password,
  });

  try {
    await addedUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed", 500);
    console.log(err);
    return next(error);
  }
  res.status(201).json({ user: addedUser });
};

const login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const param = errors.errors[0].param;
    throw new HttpError(
      `invalid inputs passed for ${param}, please check your input`,
      422
    );
  }
  const { password, email } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    return res
      .status(200)
      .json({ messege: `login  success for ${user.name} :) ` });
  }
  return next(new HttpError('user not found or wrong email or password', 400));
};
module.exports = { getAllUser, signup, login };
