const { z } = require('zod');

const email = z.string().trim().toLowerCase().email().max(255);
const password = z.string().min(8).max(72);

const registerSchema = z.object({
    first_name: z.string().trim().min(1).max(100),
    last_name: z.string().trim().min(1).max(100),
    email,
    password
}).strict();

const loginSchema = z.object({
    email,
    password: z.string().min(1).max(72)
}).strict();

const adminRegisterSchema = z.object({
    username: z.string().trim().min(3).max(100),
    password,
    email
}).strict();

const adminLoginSchema = z.object({
    username: z.string().trim().min(3).max(100),
    password: z.string().min(1).max(72)
}).strict();

const doctorRegisterSchema = z.object({
    first_name: z.string().trim().min(1).max(100),
    last_name: z.string().trim().min(1).max(100),
    email,
    password,
    specialization: z.string().trim().min(1).max(100),
    phone: z.string().trim().max(30).optional().default('')
}).strict();

const doctorLoginSchema = z.object({
    email,
    password: z.string().min(1).max(72)
}).strict();

const profileSchema = z.object({
    first_name: z.string().trim().min(1).max(100),
    last_name: z.string().trim().min(1).max(100),
    email
}).strict();

const appointmentSchema = z.object({
    doctor_id: z.coerce.number().int().positive(),
    appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    appointment_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
}).strict().superRefine((value, ctx) => {
    const appointment = new Date(`${value.appointment_date}T${value.appointment_time}:00`);
    if (Number.isNaN(appointment.getTime()) || appointment <= new Date()) {
        ctx.addIssue({
            code: 'custom',
            path: ['appointment_date'],
            message: 'Appointment must be scheduled in the future'
        });
    }
});

const rescheduleSchema = z.object({
    appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    appointment_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
}).strict().superRefine((value, ctx) => {
    const appointment = new Date(`${value.appointment_date}T${value.appointment_time}:00`);
    if (Number.isNaN(appointment.getTime()) || appointment <= new Date()) {
        ctx.addIssue({
            code: 'custom',
            path: ['appointment_date'],
            message: 'Appointment must be scheduled in the future'
        });
    }
});

const positiveIdSchema = z.object({
    id: z.coerce.number().int().positive()
});

module.exports = {
    registerSchema,
    loginSchema,
    adminRegisterSchema,
    adminLoginSchema,
    doctorRegisterSchema,
    doctorLoginSchema,
    profileSchema,
    appointmentSchema,
    rescheduleSchema,
    positiveIdSchema
};
