const jwt = require('jsonwebtoken');

exports.getUserFromHeaders = function getUserFromHeaders(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return { isAuth: false, userId: null };
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return { isAuth: false, userId: null };
  }
  if (!decodedToken) {
    return { isAuth: false, userId: null };
  }
  return {
    isAuth: true,
    userId: decodedToken.userId,
  };
};
