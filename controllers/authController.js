const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure environment variables are loaded

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send confirmation emails
const sendConfirmationEmail = (email, subject, message) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Successfully created an account",
        text:"Welcome to Telemedicine!"
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// User registration
exports.register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO Patients (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)';
        await pool.execute(query, [first_name, last_name, email, hashedPassword]);
        
        // Send confirmation email
        sendConfirmationEmail(email, 'Registration Successful', 'Thank you for registering with Telemedicine App.');
        
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ message: 'Failed to register patient' });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.execute('SELECT * FROM Patients WHERE email = ?', [email]);

        if (rows.length > 0 && await bcrypt.compare(password, rows[0].password_hash)) {
            req.session.userId = rows[0].id;
            res.json({ message: 'Logged in successfully' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in patient:', error);
        res.status(500).json({ message: 'Failed to login patient' });
    }
};

// Admin registration
exports.adminRegister = async (req, res) => {
    const { username, password, role, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO Admin (username, password_hash, role) VALUES (?, ?, ?)';
        await pool.execute(query, [username, hashedPassword, role]);

        // Send confirmation email
        sendConfirmationEmail(email, 'Admin Registration Successful', 'Welcome to the Telemedicine App as an Admin!');
        
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: 'Failed to register admin' });
    }
};

// Admin login
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.execute('SELECT * FROM Admin WHERE username = ?', [username]);

        if (rows.length > 0 && await bcrypt.compare(password, rows[0].password_hash)) {
            req.session.adminId = rows[0].id;
            res.json({ message: 'Logged in successfully' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ message: 'Failed to login admin' });
    }
};

// Fetch user profile
exports.getProfile = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT first_name, last_name, email FROM Patients WHERE id = ?', [req.session.userId]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const { first_name, last_name, email } = req.body;
    
    try {
        const query = 'UPDATE Patients SET first_name = ?, last_name = ? WHERE id = ? AND email = ?';
        await pool.execute(query, [first_name, last_name, req.session.userId, email]);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};
