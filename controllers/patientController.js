const patientService = require('../services/patientService');

exports.getPatients = async (req, res, next) => {
    try {
        res.json(await patientService.listPatients());
    } catch (error) {
        next(error);
    }
};
