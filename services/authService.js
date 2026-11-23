const bcrypt = require('bcryptjs');
const repository = require('../repositories/authRepository');

async function registerPatient(input) {
    const passwordHash = await bcrypt.hash(input.password, 12);
    await repository.createPatient({ ...input, passwordHash });
}

async function authenticatePatient(email, password) {
    const patient = await repository.findPatientByEmail(email);
    if (!patient || !(await bcrypt.compare(password, patient.password_hash))) {
        return null;
    }
    return { id: patient.id, role: 'patient' };
}

async function registerAdmin(input) {
    const passwordHash = await bcrypt.hash(input.password, 12);
    await repository.createAdmin({ username: input.username, passwordHash });
}

async function authenticateAdmin(username, password) {
    const admin = await repository.findAdminByUsername(username);
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
        return null;
    }
    return { id: admin.id, role: 'admin' };
}

async function getProfile(patientId) {
    return repository.getPatientProfile(patientId);
}

async function updateProfile(patientId, profile) {
    await repository.updatePatientProfile(patientId, profile);
}

module.exports = {
    registerPatient,
    authenticatePatient,
    registerAdmin,
    authenticateAdmin,
    getProfile,
    updateProfile
};
