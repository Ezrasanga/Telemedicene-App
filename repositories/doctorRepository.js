const db = require('../config/db');

async function listDoctors() {
    const [rows] = await db.query(
        `SELECT id, first_name, last_name, specialization, email, phone
         FROM doctors
         ORDER BY first_name, last_name`
    );
    return rows;
}

async function findDoctorById(connection, doctorId) {
    const [rows] = await connection.execute(
        'SELECT id FROM doctors WHERE id = ? FOR UPDATE',
        [doctorId]
    );
    return rows[0] || null;
}

async function findDoctorByEmail(email) {
    const [rows] = await db.execute(
        'SELECT id, first_name, last_name, email, password_hash FROM doctors WHERE email = ? LIMIT 1',
        [email]
    );
    return rows[0] || null;
}

async function createDoctor(doctor) {
    await db.execute(
        `INSERT INTO doctors
         (first_name, last_name, email, phone, specialization, password_hash)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            doctor.first_name,
            doctor.last_name,
            doctor.email,
            doctor.phone,
            doctor.specialization,
            doctor.passwordHash
        ]
    );
}

async function listAppointments(doctorId) {
    const [rows] = await db.execute(
        `SELECT a.id, a.patient_id, a.appointment_date, a.appointment_time, a.status,
                p.first_name AS patient_first_name, p.last_name AS patient_last_name,
                p.email AS patient_email
         FROM Appointments a
         JOIN Patients p ON p.id = a.patient_id
         WHERE a.doctor_id = ?
         ORDER BY a.appointment_date, a.appointment_time`,
        [doctorId]
    );
    return rows;
}

module.exports = {
    listDoctors,
    findDoctorById,
    findDoctorByEmail,
    createDoctor,
    listAppointments
};
