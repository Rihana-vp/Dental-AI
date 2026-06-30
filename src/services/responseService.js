/**
 * responseService.js
 * Builds the structured API response object for each detected intent.
 * Keeps all reply templates and business logic in one place.
 */

const { INTENTS } = require("./intentService");
const { createAppointment } = require("./bookingService");
const { extractDate, FALLBACK_DATE } = require("../utils/extractDate");
const { extractService } = require("../utils/extractService");
const clinicData = require("../data/clinicData");

// ─── Static Reply Templates ───────────────────────────────────────────────────
const REPLIES = {
  ASK_TIMINGS:   `We are open ${clinicData.operatingHours.display}.`,
  ASK_SERVICES:  `We provide ${clinicData.services.join(", ")}.`,
  GENERAL_QUERY: `Hello! Welcome to ${clinicData.name}. How can I assist you today?`,
};

/**
 * Builds the booking intent response.
 * Extracts service and date, persists the appointment, and returns the payload.
 *
 * @param {string} message - Raw user input
 * @returns {object} - Structured response object
 */
const buildBookingResponse = (message) => {
  const service = extractService(message);
  const date    = extractDate(message);

  // Only persist if a valid service was identified
  if (service) {
    createAppointment(service, date);
  }

  const serviceLabel = service || "your requested service";
  const dateLabel    = date !== FALLBACK_DATE ? ` ${date.toLowerCase()}` : "";

  return {
    intent:  INTENTS.BOOK_APPOINTMENT,
    service: service || null,
    date,
    reply:   `Sure! I can help you book a ${serviceLabel} appointment${dateLabel}.`,
  };
};

/**
 * Builds the timings intent response.
 *
 * @returns {object} - Structured response object
 */
const buildTimingsResponse = () => ({
  intent: INTENTS.ASK_TIMINGS,
  reply:  REPLIES.ASK_TIMINGS,
});

/**
 * Builds the services intent response.
 *
 * @returns {object} - Structured response object
 */
const buildServicesResponse = () => ({
  intent: INTENTS.ASK_SERVICES,
  reply:  REPLIES.ASK_SERVICES,
});

/**
 * Builds the general query fallback response.
 *
 * @returns {object} - Structured response object
 */
const buildGeneralResponse = () => ({
  intent: INTENTS.GENERAL_QUERY,
  reply:  REPLIES.GENERAL_QUERY,
});

/**
 * Master response builder — routes to the correct builder based on intent.
 *
 * @param {string} intent  - Detected intent constant
 * @param {string} message - Raw user input (needed for booking extraction)
 * @returns {object} - Final structured response payload
 */
const buildResponse = (intent, message) => {
  switch (intent) {
    case INTENTS.BOOK_APPOINTMENT: return buildBookingResponse(message);
    case INTENTS.ASK_TIMINGS:     return buildTimingsResponse();
    case INTENTS.ASK_SERVICES:    return buildServicesResponse();
    default:                       return buildGeneralResponse();
  }
};

module.exports = { buildResponse };
