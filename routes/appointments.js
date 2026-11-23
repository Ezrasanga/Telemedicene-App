const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate, authorizeRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { appointmentSchema, rescheduleSchema, positiveIdSchema } = require('../validation/schemas');

// Route for booking an appointment
router.post('/book', authenticate, authorizeRole('patient'), validate(appointmentSchema), appointmentController.bookAppointment);
router.get('/appointments', authenticate, authorizeRole('patient'), appointmentController.getPatientAppointments);
router.patch('/appointments/:id/reschedule', authenticate, authorizeRole('patient'), validate(positiveIdSchema, 'params'), validate(rescheduleSchema), appointmentController.rescheduleAppointment);
router.patch('/appointments/:id/cancel', authenticate, authorizeRole('patient'), validate(positiveIdSchema, 'params'), appointmentController.cancelAppointment);

module.exports = router;
