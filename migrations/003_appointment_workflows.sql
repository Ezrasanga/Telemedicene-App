ALTER TABLE Appointments
    MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'scheduled';

ALTER TABLE Appointments
    ADD INDEX idx_appointments_booking (doctor_id, appointment_date, appointment_time, status),
    ADD INDEX idx_appointments_patient (patient_id, appointment_date, appointment_time);
