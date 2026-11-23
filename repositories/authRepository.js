const db = require('../config/db');

async function findPatientByEmail(email) {
    const [rows] = await db.execute(
        'SELECT id, first_name, last_name, email, password_hash FROM Patients WHERE email = ? LIMIT 1',
        [email]
    );
    return rows[0] || null;
}

async function createPatient(patient) {
    await db.execute(
        'INSERT INTO Patients (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
        [patient.first_name, patient.last_name, patient.email, patient.passwordHash]
    );
}

async function findAdminByUsername(username) {
    const [rows] = await db.execute(
        'SELECT id, username, role, password_hash FROM Admin WHERE username = ? LIMIT 1',
        [username]
    );
    return rows[0] || null;
}

async function createAdmin(admin) {
    await db.execute(
        'INSERT INTO Admin (username, password_hash, role) VALUES (?, ?, ?)',
        [admin.username, admin.passwordHash, 'admin']
    );
}

async function getPatientProfile(patientId) {
    const [rows] = await db.execute(
        'SELECT first_name, last_name, email FROM Patients WHERE id = ? LIMIT 1',
        [patientId]
    );
    return rows[0] || null;
}

async function updatePatientProfile(patientId, profile) {
    await db.execute(
        'UPDATE Patients SET first_name = ?, last_name = ? WHERE id = ?',
        [profile.first_name, profile.last_name, patientId]
    );
}

module.exports = {
    findPatientByEmail,
    createPatient,
    findAdminByUsername,
    createAdmin,
    getPatientProfile,
    updatePatientProfile
};
