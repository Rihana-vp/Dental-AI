/**
 * validateMessage.js
 * Express middleware that validates the incoming chat request body.
 * Rejects requests with a missing or empty "message" field with HTTP 400.
 */

/**
 * Validates that req.body.message exists and is a non-empty string.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validateMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  // Normalize the message (trim whitespace) before passing downstream
  req.body.message = message.trim();

  next();
};

module.exports = validateMessage;
