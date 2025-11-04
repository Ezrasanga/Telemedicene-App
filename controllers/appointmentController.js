const pool = require('../config/db');

// Function to book an appointment
exports.bookAppointment = async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;
    const query = `
        INSERT INTO Appointments 
        (patient_id, doctor_id, appointment_date, appointment_time, status) 
        VALUES (?, ?, ?, ?, "scheduled")
    `;

    try {
        await pool.execute(query, [patient_id, doctor_id, appointment_date, appointment_time]);
        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Failed to book appointment' });
    }
};
