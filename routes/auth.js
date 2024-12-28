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
      .custom((value) => {
        return User.findOne({ email: value }).then((existingUser) => {
          if (existingUser) {
            return Promise.reject(
              'An account with this email already exists. Please pick a different email address'
            );
          }
        });
      }),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  authController.signup
);

module.exports = router;
