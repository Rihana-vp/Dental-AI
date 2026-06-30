/**
 * chatRoutes.js
 * Defines all /api routes for the SmileCare chat API.
 * Applies request validation middleware before the controller.
 */

const express = require("express");
const router  = express.Router();

const validateMessage = require("../middleware/validateMessage");
const { handleChat }  = require("../controllers/chatController");

// POST /api/chat — primary conversational endpoint
router.post("/chat", validateMessage, handleChat);

module.exports = router;
