const { query, validationResult, matchedData } = require('express-validator');

const ITEMS_PER_PAGE = 2;

function pageValidate() {
  return query('page').optional().isInt({ min: 1 }).toInt();
}

function getPaginationHelper(mongooseModel) {
  return function paginationHelper(req, res, next) {
    const validationMiddleware = pageValidate();
    validationMiddleware(req, res, () => {
      const errors = validationResult(req);
      let { page } = matchedData(req, { includeOptionals: true });
      page = page || 1;
      if (!errors.isEmpty()) {
        return next(getInvalidPageError());
      }
      mongooseModel
        .countDocuments()
        .then((totalItems) => {
          const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
          if (page > totalPages) {
            throw getInvalidPageError();
          }
          res.locals.pagination = {
            skip: (page - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
            totalItems,
          };
          next();
        })
        .catch(next);
    });
  };
}

module.exports = getPaginationHelper;

function getInvalidPageError() {
  const error = new Error('Invalid page number.');
  error.statusCode = 422;
  return error;
}
