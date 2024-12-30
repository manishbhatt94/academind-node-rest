require('dotenv').config();
const mongoose = require('mongoose');

const Post = require('../models/post');
const User = require('../models/user');

const userObjectIds = ['677001d0b9ec0faf33698ae1', '677248ae9049135ff904fce4'];

function databaseConnect() {
  return mongoose.connect(process.env.MONGO_CONNECTION_URI).then(() => {
    console.log('Connected to MongoDB');
  });
}

function databaseDisconnect() {
  return mongoose.disconnect().then(() => {
    console.log('Disconnected from MongoDB');
  });
}

async function populateUsersMap(userIds) {
  const usersMap = {};
  for (const userId of userIds) {
    const user = await User.findById(userId);
    usersMap[user._id.toString()] = user;
  }
  return usersMap;
}

async function populatePosts() {
  const posts = await Post.find();
  return posts;
}

async function connectPostsToUsers(posts, usersMap) {
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const user = usersMap[i % 2 === 0 ? userObjectIds[0] : userObjectIds[1]];
    post.creator = user;
    await post.save();
    user.posts.push(post);
    await user.save();
  }
}

async function main() {
  await databaseConnect();
  const usersMap = await populateUsersMap(userObjectIds);
  const posts = await populatePosts();
  await connectPostsToUsers(posts, usersMap);
  await databaseDisconnect();
}

main();
