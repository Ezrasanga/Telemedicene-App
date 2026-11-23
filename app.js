const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const { authenticate, authorizeRole, requirePatientPage } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/validation');

// Import routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctors');
const patientRoutes = require('./routes/patients');

// Initialize app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Protect privileged static pages before serving public assets.
app.get('/admin-register.html', authenticate, authorizeRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-register.html'));
});

app.get('/book.html', requirePatientPage, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'book.html'));
});

app.get('/book', requirePatientPage, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'book.html'));
});

app.get('/appointment.html', requirePatientPage, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'appointment.html'));
});

app.get('/appointments', requirePatientPage, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'appointment.html'));
});

app.get('/profile.html', requirePatientPage, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for serving HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.get('/admin-register', authenticate, authorizeRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-register.html'));
});

app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/doctor/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'doctor-register.html'));
});

app.get('/doctor/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'doctor-login.html'));
});

app.get('/doctor/dashboard', authenticate, authorizeRole('doctor'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'doctor-dashboard.html'));
});

// API routes
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);

app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

