const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/', authenticate, authorizeRole('admin'), patientController.getPatients);

module.exports = router;
