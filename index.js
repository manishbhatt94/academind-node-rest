const { createServer } = require('node:http');
const path = require('node:path');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socket = require('./services/socket');

const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed');

const app = express();
const server = createServer(app);

app.set('strict routing', true);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(bodyParser.json());

app.use(function setCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const io = socket.init(server);
io.on('connection', (socket) => {
  console.log('A client connected to Socket.io server.');
});

app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message, data } = err;
  res.status(statusCode).json({ message, data });
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
    server.listen(+process.env.SERVER_PORT, () =>
      console.log(`Server listening on port ${process.env.SERVER_PORT}`)
    );
  })
  .catch((err) => {
    console.error('setup error', err);
  });
