const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', postValidationMiddlewares(), feedController.createPost);

// GET /feed/post/:postId
router.get('/post/:postId', feedController.getPostDetails);

module.exports = router;

function postValidationMiddlewares() {
  return [
    body('title', 'Please enter valid title').trim().isString().isLength({ min: 5, max: 255 }),
    body('content', 'Please enter valid content').trim().isLength({ min: 5, max: 400 }),
  ];
}
