const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController'); // Ensure the path is correct

// Route to get a list of all doctors
router.get('/', doctorController.getAllDoctors);

// Placeholder for adding more routes for doctor-specific actions if needed
// e.g., router.post('/', doctorController.addDoctor);

module.exports = router;
