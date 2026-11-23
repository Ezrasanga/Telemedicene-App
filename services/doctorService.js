const repository = require('../repositories/doctorRepository');
const bcrypt = require('bcryptjs');

function listDoctors() {
    return repository.listDoctors();
}

async function registerDoctor(input) {
    const passwordHash = await bcrypt.hash(input.password, 12);
    await repository.createDoctor({ ...input, passwordHash });
}

async function authenticateDoctor(email, password) {
    const doctor = await repository.findDoctorByEmail(email);
    if (!doctor || !(await bcrypt.compare(password, doctor.password_hash))) {
        return null;
    }
    return { id: doctor.id, role: 'doctor' };
}

function listAppointments(doctorId) {
    return repository.listAppointments(doctorId);
}

module.exports = {
    listDoctors,
    registerDoctor,
    authenticateDoctor,
    listAppointments
};
