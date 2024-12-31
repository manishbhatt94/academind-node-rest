exports.asyncHandler = function asyncHandler(middleware) {
  return function wrappedMiddleware(req, res, next) {
    Promise.resolve(middleware(req, res, next)).catch(next);
  };
};
