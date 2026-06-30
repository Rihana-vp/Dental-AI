/**
 * intentService.js
 * Determines the user's conversational intent based on keyword matching.
 * Returns one of four supported intent constants.
 */

// ─── Intent Constants ─────────────────────────────────────────────────────────
const INTENTS = {
  BOOK_APPOINTMENT: "BOOK_APPOINTMENT",
  ASK_TIMINGS:      "ASK_TIMINGS",
  ASK_SERVICES:     "ASK_SERVICES",
  GENERAL_QUERY:    "GENERAL_QUERY",
};

// ─── Keyword Maps ─────────────────────────────────────────────────────────────
const BOOKING_KEYWORDS  = ["book", "appointment", "schedule"];
const TIMINGS_KEYWORDS  = ["timing", "timings", "hours", "open"];
const SERVICES_KEYWORDS = ["service", "services", "treatment", "treatments"];

/**
 * Checks whether any keyword from a list appears in the lowercased message.
 *
 * @param {string}   lowerMessage - Lowercased user message
 * @param {string[]} keywords     - List of trigger keywords
 * @returns {boolean}
 */
const containsKeyword = (lowerMessage, keywords) =>
  keywords.some((kw) => lowerMessage.includes(kw));

/**
 * Detects the user's intent from their raw message string.
 *
 * Priority order:
 *  1. BOOK_APPOINTMENT
 *  2. ASK_TIMINGS
 *  3. ASK_SERVICES
 *  4. GENERAL_QUERY (default)
 *
 * @param {string} message - Raw user input
 * @returns {string} - One of the INTENTS values
 */
const detectIntent = (message) => {
  const lower = message.toLowerCase();

  if (containsKeyword(lower, BOOKING_KEYWORDS))  return INTENTS.BOOK_APPOINTMENT;
  if (containsKeyword(lower, TIMINGS_KEYWORDS))  return INTENTS.ASK_TIMINGS;
  if (containsKeyword(lower, SERVICES_KEYWORDS)) return INTENTS.ASK_SERVICES;

  return INTENTS.GENERAL_QUERY;
};

module.exports = { detectIntent, INTENTS };
