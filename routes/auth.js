// auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorizeRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
    registerSchema,
    loginSchema,
    adminRegisterSchema,
    adminLoginSchema,
    profileSchema
} = require('../validation/schemas');

// Route for user registration
router.post('/register', validate(registerSchema), authController.register);

// Route for user login
router.post('/login', validate(loginSchema), authController.login);

// Route for fetching profile
router.get('/profile', authenticate, authorizeRole('patient'), authController.getProfile);

// Route for updating profile
router.put('/profile', authenticate, authorizeRole('patient'), validate(profileSchema), authController.updateProfile);

// Route for admin registration
router.post('/admin/register', authenticate, authorizeRole('admin'), validate(adminRegisterSchema), authController.adminRegister);

// Route for admin login
router.post('/admin/login', validate(adminLoginSchema), authController.adminLogin);
router.post('/auth/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);

router.get('/me', authenticate, (req, res) => {
    res.json({ id: req.user.id, role: req.user.role });
});

module.exports = router;
