const fs = require('node:fs');
const path = require('node:path');

const { validationResult } = require('express-validator');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
  const { pagination } = res.locals;
  Post.find()
    .skip(pagination.skip)
    .limit(pagination.limit)
    .populate({
      path: 'creator',
      select: 'name -_id',
    })
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully.',
        totalItems: pagination.totalItems,
        posts,
      });
    })
    .catch(next);
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided or file upload is invalid.');
    error.statusCode = 422;
    throw error;
  }
  const { title, content } = req.body;
  let savedPost;
  let postCreator;

  const post = new Post({
    title,
    content,
    imageUrl: req.file.path,
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      savedPost = result;
      return User.findById(req.userId);
    })
    .then((user) => {
      postCreator = user;
      user.posts.push(savedPost);
      return user.save();
    })
    .then(() => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: savedPost,
        creator: {
          _id: postCreator._id.toString(),
          name: postCreator.name,
        },
      });
    })
    .catch(next);
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const { postId } = req.params;
  const { title, content } = req.body;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      ensurePostExistance(post);
      ensureAuthorizionForActionOnPost(post, req);
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch(next);
};

exports.getPostDetails = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      ensurePostExistance(post);
      res.status(200).json({ message: 'Post fetched.', post });
    })
    .catch(next);
};

exports.deletePost = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      ensurePostExistance(post);
      ensureAuthorizionForActionOnPost(post, req);
      clearImage(post.imageUrl);
      return post.deleteOne();
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: 'Deleted post.' });
    })
    .catch(next);
};

exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      res.status(200).json({ message: 'Status fetched.', status: user.status });
    })
    .catch(next);
};

exports.updateStatus = (req, res, next) => {
  const { status } = req.body;
  User.findById(req.userId)
    .then((user) => {
      user.status = status;
      return user.save();
    })
    .then(() => {
      res.status(201).json({ message: 'Status updated.' });
    })
    .catch(next);
};

function ensurePostExistance(post) {
  if (!post) {
    const error = new Error('Could not find post.');
    error.statusCode = 404;
    throw error;
  }
}

function ensureAuthorizionForActionOnPost(post, req) {
  if (post.creator.toString() !== req.userId) {
    const error = new Error('Not authorized');
    error.statusCode = 403;
    throw error;
  }
}

function clearImage(filePath) {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
}
