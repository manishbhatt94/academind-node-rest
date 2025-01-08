const path = require('node:path');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createHandler } = require('graphql-http/lib/use/express');

const { getUserFromHeaders } = require('./middlewares/auth');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');

const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(bodyParser.json());

app.use(function setCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.all(
  '/graphql',
  createHandler({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    context: async function getContext(req) {
      const authInfo = getUserFromHeaders(req);
      const ctx = {
        ...authInfo,
      };
      return ctx;
    },
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const { data, statusCode = 500 } = err.originalError;
      const { message = 'An error occurred.' } = err;
      return { message, data, statusCode };
    },
  })
);

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
    app.listen(+process.env.SERVER_PORT, () =>
      console.log(`Server listening on port ${process.env.SERVER_PORT}`)
    );
  })
  .catch((err) => {
    console.error('setup error', err);
  });
