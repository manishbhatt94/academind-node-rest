const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

const upload = prepareUploadMiddleware();

// POST /feed/post
router.post(
  '/post',
  upload.single('image'),
  postValidationMiddlewares(),
  feedController.createPost
);

// GET /feed/post/:postId
router.get('/post/:postId', feedController.getPostDetails);

// PUT /feed/post/:postId
router.put(
  '/post/:postId',
  upload.single('image'),
  postValidationMiddlewares(),
  feedController.updatePost
);

module.exports = router;

function postValidationMiddlewares() {
  return [
    body('title', 'Please enter valid title').trim().isString().isLength({ min: 5, max: 255 }),
    body('content', 'Please enter valid content').trim().isLength({ min: 5, max: 400 }),
  ];
}

function prepareUploadMiddleware() {
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      const now = new Date().getTime();
      const rand = Math.floor(Math.random() * 1e9);
      cb(null, `${now}-${rand}-${file.originalname}`);
    },
  });
  const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  return multer({ storage: fileStorage, fileFilter });
}
