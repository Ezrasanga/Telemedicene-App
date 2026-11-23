const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticate, authorizeRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { doctorRegisterSchema, doctorLoginSchema } = require('../validation/schemas');

// Route to get a list of all doctors
router.get('/', doctorController.getAllDoctors);
router.post('/register', validate(doctorRegisterSchema), doctorController.register);
router.post('/login', validate(doctorLoginSchema), doctorController.login);
router.get('/appointments', authenticate, authorizeRole('doctor'), doctorController.getAppointments);

// Placeholder for adding more routes for doctor-specific actions if needed
// e.g., router.post('/', doctorController.addDoctor);

module.exports = router;
