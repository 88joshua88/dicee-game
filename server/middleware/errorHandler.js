/**
 * errorHandler — centralised Express error middleware.
 *
 * Must be the LAST app.use() call in index.js so it catches errors
 * forwarded via next(err) from any route or middleware.
 *
 * Returns a consistent JSON error shape across the entire API:
 *   { success: false, message: "...", stack: "..." (dev only) }
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Expose stack trace in development only
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = errorHandler;
