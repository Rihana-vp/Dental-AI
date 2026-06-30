/**
 * bookingService.js
 * Manages in-memory appointment storage and booking logic.
 * Provides create and list operations on the appointments array.
 */

const { v4: uuidv4 } = require("uuid");

// ─── In-Memory Store ──────────────────────────────────────────────────────────
// Persists for the duration of the server process.
const appointments = [];

/**
 * Creates and stores a new appointment.
 *
 * @param {string} service - Dental service requested
 * @param {string} date    - Extracted date string (e.g. "Tomorrow")
 * @returns {object} - The newly created appointment record
 */
const createAppointment = (service, date) => {
  const appointment = {
    id:        uuidv4(),
    service,
    date,
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);
  return appointment;
};

/**
 * Returns a shallow copy of all stored appointments.
 *
 * @returns {object[]}
 */
const getAllAppointments = () => [...appointments];

/**
 * Returns the total number of stored appointments.
 *
 * @returns {number}
 */
const getAppointmentCount = () => appointments.length;

module.exports = { createAppointment, getAllAppointments, getAppointmentCount };
