/**
 * chatController.js
 * Handles the POST /api/chat request lifecycle.
 * Orchestrates intent detection → response building → HTTP reply.
 */

const { detectIntent } = require("../services/intentService");
const { buildResponse } = require("../services/responseService");

/**
 * POST /api/chat
 * Accepts a user message and returns an intent-driven structured response.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const handleChat = (req, res, next) => {
  try {
    const { message } = req.body;

    // Step 1: Detect intent from user message
    const intent = detectIntent(message);

    // Step 2: Build the structured response payload
    const responsePayload = buildResponse(intent, message);

    // Step 3: Return success response
    return res.status(200).json({
      success: true,
      ...responsePayload,
    });
  } catch (error) {
    // Delegate unexpected errors to the centralized error handler
    next(error);
  }
};

module.exports = { handleChat };
