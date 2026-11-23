const nodemailer = require('nodemailer');
require('dotenv').config();
const {
    setAuthCookies,
    clearAuthCookies,
    REFRESH_COOKIE
} = require('../middleware/auth');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

function sendConfirmationEmail(email) {
    transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Successfully created an account',
        text: 'Welcome to Telemedicine!'
    }, error => {
        if (error) console.error('Error sending email:', error);
    });
}

exports.register = async (req, res, next) => {
    try {
        await authService.registerPatient(req.body);
        sendConfirmationEmail(req.body.email);
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        if (error?.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: { code: 'CONFLICT', message: 'A patient with this email already exists' }
            });
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const subject = await authService.authenticatePatient(req.body.email, req.body.password);
        if (!subject) {
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
        }
        setAuthCookies(res, subject);
        res.json({ message: 'Logged in successfully' });
    } catch (error) {
        next(error);
    }
};

exports.adminRegister = async (req, res, next) => {
    try {
        await authService.registerAdmin(req.body);
        sendConfirmationEmail(req.body.email);
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        if (error?.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: { code: 'CONFLICT', message: 'An administrator with this username or email already exists' }
            });
        }
        next(error);
    }
};

exports.adminLogin = async (req, res, next) => {
    try {
        const subject = await authService.authenticateAdmin(req.body.username, req.body.password);
        if (!subject) {
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
        }
        setAuthCookies(res, subject);
        res.json({ message: 'Logged in successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const profile = await authService.getProfile(req.user.id);
        if (!profile) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
        }
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        await authService.updateProfile(req.user.id, req.body);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.refresh = (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
        return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Refresh authentication required' } });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET, { issuer: 'telemedicine-app' });
        setAuthCookies(res, { id: payload.id, role: payload.role });
        res.json({ message: 'Authentication refreshed' });
    } catch (error) {
        clearAuthCookies(res);
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired refresh authentication' } });
    }
};

exports.logout = (req, res) => {
    clearAuthCookies(res);
    res.json({ message: 'Logged out successfully' });
};
