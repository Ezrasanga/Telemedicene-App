const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Route for booking an appointment
router.post('/book', appointmentController.bookAppointment);

module.exports = router;
