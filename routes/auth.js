const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error(
            'An account with this email already exists. Please pick a different email address'
          );
        }
      }),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
