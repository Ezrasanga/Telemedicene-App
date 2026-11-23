const appointmentService = require('../services/appointmentService');

exports.bookAppointment = async (req, res, next) => {
    try {
        await appointmentService.bookAppointment(req.user.id, req.body);
        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                error: { code: error.status === 409 ? 'CONFLICT' : 'NOT_FOUND', message: error.message }
            });
        }
        next(error);
    }
};

exports.getPatientAppointments = async (req, res, next) => {
    try {
        res.json(await appointmentService.listAppointments(req.user.id));
    } catch (error) {
        next(error);
    }
};

exports.rescheduleAppointment = async (req, res, next) => {
    try {
        await appointmentService.rescheduleAppointment(req.params.id, req.user.id, req.body);
        res.json({ message: 'Appointment rescheduled successfully' });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                error: { code: error.status === 409 ? 'CONFLICT' : 'NOT_FOUND', message: error.message }
            });
        }
        next(error);
    }
};

exports.cancelAppointment = async (req, res, next) => {
    try {
        await appointmentService.cancelAppointment(req.params.id, req.user.id);
        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        if (error.status) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        next(error);
    }
};
