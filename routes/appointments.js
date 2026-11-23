const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Route for booking an appointment
router.post('/book', appointmentController.bookAppointment);
router.get('/appointments', appointmentController.getPatientAppointments);

module.exports = router;
