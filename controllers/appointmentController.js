const pool = require('../config/db');

// Function to book an appointment
exports.bookAppointment = async (req, res) => {
    const { doctor_id, appointment_date, appointment_time } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please log in to book an appointment' });
    }

    if (!doctor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({ message: 'Doctor, date, and time are required' });
    }

    const query = `
        INSERT INTO Appointments 
        (patient_id, doctor_id, appointment_date, appointment_time, status) 
        VALUES (?, ?, ?, ?, "scheduled")
    `;

    try {
        await pool.execute(query, [req.session.userId, doctor_id, appointment_date, appointment_time]);
        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Failed to book appointment' });
    }
};

exports.getPatientAppointments = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please log in to view appointments' });
    }

    try {
        const [appointments] = await pool.execute(
            `SELECT * FROM Appointments
             WHERE patient_id = ?
             ORDER BY appointment_date, appointment_time`,
            [req.session.userId]
        );
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Failed to fetch appointments' });
    }
};
