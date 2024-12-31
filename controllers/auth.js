const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const { asyncHandler } = require('../middlewares/async-handler');
const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, name, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        name,
        password: hashedPassword,
        posts: [],
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch(next);
};

exports.login = asyncHandler(async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw getLoginFailedError();
  }
  const doMatch = await bcrypt.compare(password, user.password);
  if (!doMatch) {
    throw getLoginFailedError();
  }
  const token = jwt.sign(
    {
      email: user.email,
      name: user.name,
      userId: user._id.toString(),
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
  res.status(200).json({
    token,
    userId: user._id.toString(),
  });

  function getLoginFailedError() {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    return error;
  }
});
