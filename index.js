const path = require('node:path');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(bodyParser.json());

app.use(function setCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({ message });
});

function databaseConnect() {
  return mongoose.connect(process.env.MONGO_CONNECTION_URI).then(() => {
    console.log('Connected to MongoDB');
  });
}

function setup() {
  return databaseConnect();
}

setup()
  .then(() => {
    app.listen(+process.env.SERVER_PORT, () =>
      console.log(`Server listening on port ${process.env.SERVER_PORT}`)
    );
  })
  .catch((err) => {
    console.error('setup error', err);
  });
