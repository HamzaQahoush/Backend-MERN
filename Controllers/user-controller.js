const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator');
const User = require('../models/user');

const getAllUser = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await User.find({}, '-password').exec();
  } catch (err) {
    return next(new HttpError('Could Not find any user', 404));
  }

  res
    .status(200)
    .json({ users: allUsers.map((u) => u.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  let hasUser;
  if (!errors.isEmpty()) {
    const param = errors.errors[0].param;
    return next(
      new HttpError(
        `invalid inputs passed for ${param}, please check your input`,
        422
      )
    );
  }

  const { name, email, password } = req.body;
  console.log(req.file, 'req.file>>>>>>>>>>>>>>');
  console.log(req.body, 'req.body>>>>>>>>>>>>>>');
  if (!req.file) {
    return next(
      new HttpError(`invalid inputs passed, please check your input`, 422)
    );
  }
  try {
    hasUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('signing up failed', 500));
  }
  if (hasUser) {
    return next(new HttpError('user already exist', 422));
  }
  const addedUser = new User({
    name,
    email,
    password,
    image: req.file.path,
    places: [],
  });

  try {
    await addedUser.save();
  } catch (err) {
    const error = new HttpError('Creating user failed', 500);
    console.log(err);
    return next(error);
  }
  res.status(201).json({ user: addedUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const param = errors.errors[0].param;
    return next(
      new HttpError(
        `invalid inputs passed for ${param}, please check your input`,
        422
      )
    );
  }
  const { password, email } = req.body;
  let user;
  try {
    user = await User.findOne(
      { email: email, password: password },
      '-password'
    );
  } catch (error) {
    return next(new HttpError('something wrong , try again later', 500));
  }

  if (!user) {
    return next(
      new HttpError('user not found or wrong email or password', 400)
    );
  }

  return res
    .status(200)
    .json({
      message: `login  success for ${user.name} :) `,
      user: user.toObject({ getters: true }),
    });
};
module.exports = { getAllUser, signup, login };
