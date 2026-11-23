const { ZodError } = require('zod');

function validate(schema, property = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[property]);
        if (!result.success) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Request validation failed',
                    details: result.error.issues.map(issue => ({
                        field: issue.path.join('.') || property,
                        message: issue.message
                    }))
                }
            });
        }

        req[property] = result.data;
        next();
    };
}

function notFound(req, res) {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'The requested resource was not found'
        }
    });
}

function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof ZodError) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Request validation failed'
            }
        });
    }

    if (error?.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            error: {
                code: 'CONFLICT',
                message: 'The resource already exists'
            }
        });
    }

    console.error('Unhandled application error:', error);
    res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred'
        }
    });
}

module.exports = { validate, notFound, errorHandler };
