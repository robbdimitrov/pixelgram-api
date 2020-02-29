const { validateToken } = require('../services/auth-service');
const StatusCode = require('./status-code');

const allowedRoutes = [
  { method: 'OPTIONS', path: '' },
  { method: 'POST', path: '/sessions' },
  { method: 'POST', path: '/users' },
  { method: 'GET', path: '/uploads' }
];

function isAllowed(req) {
  for (const route of allowedRoutes) {
    if (req.method === route.method && req.path.indexOf(route.path) !== -1) {
      return true;
    }
  }
  return false;
}

function authChecker(req, res, next) {
  // If this is a login request, create a user request or
  // get an image request, don't check for token
  if (isAllowed(req)) {
    return next();
  }

  const token = req.get('Authorization');

  // decode token
  if (token) {
    // verifies secret and checks exp
    validateToken(token).then((result) => {
      req.user = result;
      next();
    }).catch((error) => {
      res.status(StatusCode.unauthorized).send({
        error: {
          code: StatusCode.unauthorized,
          message: error.message
        }
      });
    });
  } else {
    // if there is no token
    // return an error
    res.status(StatusCode.unauthorized).send({
      error: {
        code: StatusCode.unauthorized,
        message: 'No token provided.'
      }
    });
  }
}

module.exports = authChecker;
