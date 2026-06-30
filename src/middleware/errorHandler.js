/**
 * errorHandler.js
 * Centralized Express error-handling middleware.
 * Must be registered LAST in the middleware chain (4-argument signature).
 * Logs the stack trace in development and returns a safe JSON response.
 */

/**
 * @param {Error}                          err
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next  - Required by Express to identify as error handler
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const isDevelopment = process.env.NODE_ENV !== "production";

  // Log the full error in non-production environments
  if (isDevelopment) {
    console.error("❌ Error:", err.stack || err.message);
  } else {
    console.error("❌ Error:", err.message);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  });
};

module.exports = errorHandler;
