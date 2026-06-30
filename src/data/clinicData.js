/**
 * clinicData.js
 * Central source of truth for all static clinic information.
 * All services, hours, and contact details are managed here.
 */

const clinicData = {
  name: "SmileCare Dental",

  operatingHours: {
    days: "Monday - Friday",
    open: "10:00 AM",
    close: "7:00 PM",
    display: "Monday to Friday from 10:00 AM to 7:00 PM",
  },

  services: [
    "Dental Cleaning",
    "Root Canal",
    "Braces",
    "Teeth Whitening",
  ],

  contact: {
    phone: "9876543210",
    email: "support@smilecare.com",
  },
};

module.exports = clinicData;
