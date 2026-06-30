/**
 * extractDate.js
 * Parses a user message and extracts a date reference.
 * Supports relative day keywords and next-weekday expressions.
 */

// Ordered list of supported date keywords mapped to their display labels
const DATE_PATTERNS = [
  { pattern: /\bnext\s+monday\b/i,    label: "Next Monday" },
  { pattern: /\bnext\s+tuesday\b/i,   label: "Next Tuesday" },
  { pattern: /\bnext\s+wednesday\b/i, label: "Next Wednesday" },
  { pattern: /\bnext\s+thursday\b/i,  label: "Next Thursday" },
  { pattern: /\bnext\s+friday\b/i,    label: "Next Friday" },
  { pattern: /\btomorrow\b/i,         label: "Tomorrow" },
  { pattern: /\btoday\b/i,            label: "Today" },
];

const FALLBACK_DATE = "Date not specified";

/**
 * Extracts a human-readable date label from the user's message.
 *
 * @param {string} message - Raw user input string
 * @returns {string} - Matched date label or fallback string
 */
const extractDate = (message) => {
  for (const { pattern, label } of DATE_PATTERNS) {
    if (pattern.test(message)) {
      return label;
    }
  }
  return FALLBACK_DATE;
};

module.exports = { extractDate, FALLBACK_DATE };
