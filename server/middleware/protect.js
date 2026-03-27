const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — JWT authentication middleware.
 *
 * Expects: Authorization: Bearer <token>
 * Attaches the authenticated user to req.user on success.
 * Forwards an error via next() on failure so the centralised
 * error handler returns a consistent 401 response.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Not authorised — no token'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user (without password) to the request
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorised — user not found'));
    }
    next();
  } catch (err) {
    res.status(401);
    next(new Error('Not authorised — invalid token'));
  }
};

module.exports = protect;
