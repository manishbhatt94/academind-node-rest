const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const Post = require('../models/post');
const User = require('../models/user');

module.exports = {
  createUser: async function createUserResolver({ userInput }) {
    const { email, password, name } = userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ field: 'email', message: 'Email is invalid' });
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
      errors.push({ field: 'password', message: 'Password too short' });
    }
    if (errors.length) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.statusCode = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashedPassword,
      posts: [],
    });
    const createdUser = await user.save();
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
    };
  },

  login: async function loginResolver({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw getLoginFailedError();
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      throw getLoginFailedError();
    }
    const userId = user._id.toString();
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        userId,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
    return { token, userId };

    function getLoginFailedError() {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      return error;
    }
  },

  getPosts: async function getPostsResolver() {
    const posts = await Post.find().populate({
      path: 'creator',
    });
    return posts;
  },
};
