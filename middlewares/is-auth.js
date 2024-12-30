const jwt = require('jsonwebtoken');

module.exports = function isAuthenticated(req, res, next) {
  const token = req.get('Authorization')?.split(' ')[1];
  if (!token) {
    throw getNotAuthenticatedError();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
      case 'JsonWebTokenError':
      case 'NotBeforeError':
        err.statusCode = 401;
        break;
    }
    err.statusCode = err.statusCode || 500;
    throw err;
  }
  if (!decodedToken) {
    throw getNotAuthenticatedError();
  }
  req.userId = decodedToken.userId;
  next();

  function getNotAuthenticatedError() {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    return error;
  }
};
