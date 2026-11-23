const db = require('../config/db');
const repository = require('../repositories/appointmentRepository');
const doctorRepository = require('../repositories/doctorRepository');

async function listAppointments(patientId) {
    return repository.listForPatient(patientId);
}

async function bookAppointment(patientId, input) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const doctor = await doctorRepository.findDoctorById(connection, input.doctor_id);
        if (!doctor) {
            const error = new Error('Doctor not found');
            error.status = 404;
            throw error;
        }
        if (await repository.findConflict(connection, input.doctor_id, input.appointment_date, input.appointment_time)) {
            const error = new Error('This appointment time is already booked');
            error.status = 409;
            throw error;
        }
        await repository.create(connection, {
            patientId,
            doctorId: input.doctor_id,
            date: input.appointment_date,
            time: input.appointment_time
        });
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function rescheduleAppointment(appointmentId, patientId, input) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const appointment = await repository.findScheduledForPatient(connection, appointmentId, patientId);
        if (!appointment) {
            const error = new Error('Scheduled appointment not found');
            error.status = 404;
            throw error;
        }
        if (await repository.findConflict(connection, appointment.doctor_id, input.appointment_date, input.appointment_time, appointment.id)) {
            const error = new Error('This appointment time is already booked');
            error.status = 409;
            throw error;
        }
        await repository.reschedule(connection, appointment.id, input.appointment_date, input.appointment_time);
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function cancelAppointment(appointmentId, patientId) {
    const cancelled = await repository.cancel(appointmentId, patientId);
    if (!cancelled) {
        const error = new Error('Scheduled appointment not found');
        error.status = 404;
        throw error;
    }
}

module.exports = {
    listAppointments,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment
};
