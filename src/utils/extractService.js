/**
 * extractService.js
 * Scans a user message for a known dental service name.
 * Uses case-insensitive matching against the clinic's service catalogue.
 */

const clinicData = require("../data/clinicData");

/**
 * Extracts a matched service name from the user's message.
 * Iterates over all clinic services and returns the first match found.
 *
 * @param {string} message - Raw user input string
 * @returns {string|null} - Matched service name or null if none found
 */
const extractService = (message) => {
  const lowerMessage = message.toLowerCase();

  const matched = clinicData.services.find((service) =>
    lowerMessage.includes(service.toLowerCase())
  );

  return matched || null;
};

module.exports = { extractService };
