require('dotenv').config();
const mongoose = require('mongoose');

const Post = require('../models/post');
const User = require('../models/user');

const userObjectIds = ['677001d0b9ec0faf33698ae1', '677248ae9049135ff904fce4'];

async function databaseConnect() {
  console.log(process.env.MONGO_CONNECTION_URI);
  await mongoose.connect(process.env.MONGO_CONNECTION_URI);
  console.log('Connected to MongoDB');
}

async function databaseDisconnect() {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

async function populateUsersMap(userIds) {
  const usersMap = {};
  for (const userId of userIds) {
    const user = await User.findById(userId);
    usersMap[user._id.toString()] = user;
  }
  return usersMap;
}

async function isPostZombie(postId) {
  const post = await Post.findById(postId);
  if (!post) {
    return true;
  }
  return false;
}

async function findZombiePosts(user) {
  const zombiePostIds = [];
  for (const postId of user.posts) {
    const id = postId.toString();
    const isZombie = await isPostZombie(id);
    if (isZombie) {
      zombiePostIds.push(id);
    }
  }
  return zombiePostIds;
}

async function clearZombiePosts(user, zombies) {
  if (!zombies.length) {
    return;
  }
  user.posts = user.posts.filter((postId) => {
    return !zombies.includes(postId.toString());
  });
  await user.save();
}

async function clearZombiePostAssociation(usersMap) {
  for (const user of Object.values(usersMap)) {
    const zombiePostIds = await findZombiePosts(user);
    await clearZombiePosts(user, zombiePostIds);
  }
}

async function main() {
  await databaseConnect();
  const usersMap = await populateUsersMap(userObjectIds);
  await clearZombiePostAssociation(usersMap);
  await databaseDisconnect();
}

main();
