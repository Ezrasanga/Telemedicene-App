const doctorService = require('../services/doctorService');
const { setAuthCookies } = require('../middleware/auth');

// Get all doctors
exports.getAllDoctors = async (req, res, next) => {
    try {
        res.status(200).json(await doctorService.listDoctors());
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        await doctorService.registerDoctor(req.body);
        res.status(201).json({ message: 'Doctor account created successfully' });
    } catch (error) {
        if (error?.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: { code: 'CONFLICT', message: 'A doctor account with this email already exists' }
            });
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const subject = await doctorService.authenticateDoctor(req.body.email, req.body.password);
        if (!subject) {
            return res.status(401).json({
                error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' }
            });
        }
        setAuthCookies(res, subject);
        res.json({ message: 'Doctor login successful' });
    } catch (error) {
        next(error);
    }
};

exports.getAppointments = async (req, res, next) => {
    try {
        res.json(await doctorService.listAppointments(req.user.id));
    } catch (error) {
        next(error);
    }
};
