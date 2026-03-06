import Joi from 'joi';

const validatePostPayment = (req, res, next) => {
    const paymentSchema = Joi.object({
        reservationId: Joi.string().uuid().required().messages({
            'string.base': 'reservationId should be a string',
            'string.empty': 'reservationId cannot be empty',
            'string.uuid': 'reservationId should be a valid UUID',
            'any.required': 'reservationId is required',
        }),
        paymentDate: Joi.date().iso().required().messages({
            'date.base': 'paymentDate should be a valid ISO date',
            'date.empty': 'paymentDate cannot be empty',
            'any.required': 'paymentDate is required',
        }),
        amount: Joi.number().positive().precision(2).required().messages({
            'number.base': 'amount should be a number',
            'number.positive': 'amount must be a positive number',
            'number.empty': 'amount cannot be empty',
            'any.required': 'amount is required',
        }),
        paymentMethod: Joi.string().min(3).max(50).required().messages({
            'string.base': 'paymentMethod should be a string',
            'string.empty': 'paymentMethod cannot be empty',
            'string.min': 'paymentMethod should have at least {#limit} characters',
            'string.max': 'paymentMethod should not exceed {#limit} characters',
            'any.required': 'paymentMethod is required',
        }),
    });
    const { error } = paymentSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

const validatePutPayment = (req, res, next) => {
    const paymentSchema = Joi.object({
        reservationId: Joi.string().uuid().optional().messages({
            'string.base': 'reservationId should be a string',
            'string.empty': 'reservationId cannot be empty',
            'string.uuid': 'reservationId should be a valid UUID',
        }),
        paymentDate: Joi.date().iso().optional().messages({
            'date.base': 'paymentDate should be a valid ISO date',
            'date.empty': 'paymentDate cannot be empty',
        }),
        amount: Joi.number().positive().precision(2).optional().messages({
            'number.base': 'amount should be a number',
            'number.positive': 'amount must be a positive number',
            'number.empty': 'amount cannot be empty',
        }),
        paymentMethod: Joi.string().min(3).max(50).optional().messages({
            'string.base': 'paymentMethod should be a string',
            'string.empty': 'paymentMethod cannot be empty',
            'string.min': 'paymentMethod should have at least {#limit} characters',
            'string.max': 'paymentMethod should not exceed {#limit} characters',
        }),
    }).min(1);

    const { error } = paymentSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

export { validatePostPayment, validatePutPayment };