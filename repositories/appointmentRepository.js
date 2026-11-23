const db = require('../config/db');
const APPOINTMENT_DURATION_MINUTES = 30;

async function listForPatient(patientId) {
    const [rows] = await db.execute(
        `SELECT * FROM Appointments
         WHERE patient_id = ?
         ORDER BY appointment_date, appointment_time`,
        [patientId]
    );
    return rows;
}

async function findConflict(connection, doctorId, date, time, excludedId = null) {
    const [rows] = await connection.execute(
        `SELECT id
         FROM Appointments
         WHERE doctor_id = ?
           AND appointment_date = ?
           AND status NOT IN ('cancelled', 'completed')
           AND TIME(appointment_time) < ADDTIME(?, SEC_TO_TIME(?))
           AND ADDTIME(TIME(appointment_time), SEC_TO_TIME(?)) > ?
           ${excludedId ? 'AND id <> ?' : ''}
         LIMIT 1`,
        excludedId
            ? [doctorId, date, time, APPOINTMENT_DURATION_MINUTES * 60,
                APPOINTMENT_DURATION_MINUTES * 60, time, excludedId]
            : [doctorId, date, time, APPOINTMENT_DURATION_MINUTES * 60,
                APPOINTMENT_DURATION_MINUTES * 60, time]
    );
    return rows[0] || null;
}

async function create(connection, appointment) {
    await connection.execute(
        `INSERT INTO Appointments
         (patient_id, doctor_id, appointment_date, appointment_time, status)
         VALUES (?, ?, ?, ?, 'scheduled')`,
        [appointment.patientId, appointment.doctorId, appointment.date, appointment.time]
    );
}

async function findScheduledForPatient(connection, appointmentId, patientId) {
    const [rows] = await connection.execute(
        `SELECT id, doctor_id
         FROM Appointments
         WHERE id = ? AND patient_id = ? AND status = 'scheduled'
         LIMIT 1`,
        [appointmentId, patientId]
    );
    return rows[0] || null;
}

async function reschedule(connection, appointmentId, date, time) {
    await connection.execute(
        `UPDATE Appointments
         SET appointment_date = ?, appointment_time = ?, status = 'rescheduled'
         WHERE id = ?`,
        [date, time, appointmentId]
    );
}

async function cancel(appointmentId, patientId) {
    const [result] = await db.execute(
        `UPDATE Appointments
         SET status = 'cancelled'
         WHERE id = ? AND patient_id = ? AND status = 'scheduled'`,
        [appointmentId, patientId]
    );
    return result.affectedRows > 0;
}

module.exports = {
    listForPatient,
    findConflict,
    create,
    findScheduledForPatient,
    reschedule,
    cancel
};
