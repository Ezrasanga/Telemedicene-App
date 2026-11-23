const repository = require('../repositories/patientRepository');

function listPatients() {
    return repository.listPatients();
}

module.exports = { listPatients };
