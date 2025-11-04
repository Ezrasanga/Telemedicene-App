// auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for fetching profile
router.get('/profile', authController.getProfile);

// Route for updating profile
router.put('/profile', authController.updateProfile);

// Route for admin registration
router.post('/admin/register', authController.adminRegister);

// Route for admin login
router.post('/admin/login', authController.adminLogin);

module.exports = router;
