import Joi from 'joi';

const validatePostReservation = (req, res, next) => {
    const reservationSchema = Joi.object({
        guestId: Joi.string().uuid().required().messages({
            'string.base': 'guestId should be a string',
            'string.empty': 'guestId cannot be empty',
            'string.uuid': 'guestId should be a valid UUID',
            'any.required': 'guestId is required',
        }),
        roomId: Joi.string().uuid().required().messages({
            'string.base': 'roomId should be a string',
            'string.empty': 'roomId cannot be empty',
            'string.uuid': 'roomId should be a valid UUID',
            'any.required': 'roomId is required',
        }),
        checkInDate: Joi.number().integer().greater(0).required().messages({
            'number.base': 'checkInDate should be a valid integer',
            'number.empty': 'checkInDate cannot be empty',
            'number.integer': 'checkInDate should be an integer',
            'number.greater': 'checkInDate should be a positive number',
            'any.required': 'checkInDate is required',
        }),
        checkOutDate: Joi.number().integer().greater(Joi.ref('checkInDate')).required().messages({
            'number.base': 'checkOutDate should be a valid integer',
            'number.empty': 'checkOutDate cannot be empty',
            'number.integer': 'checkOutDate should be an integer',
            'number.greater': 'checkOutDate should be greater than checkInDate',
            'any.required': 'checkOutDate is required',
        }),
    });
    const { error } = reservationSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

const validatePutReservation = (req, res, next) => {
    const reservationSchema = Joi.object({
        guestId: Joi.string().uuid().optional().messages({
            'string.base': 'guestId should be a string',
            'string.empty': 'guestId cannot be empty',
            'string.uuid': 'guestId should be a valid UUID',
        }),
        roomId: Joi.string().uuid().optional().messages({
            'string.base': 'roomId should be a string',
            'string.empty': 'roomId cannot be empty',
            'string.uuid': 'roomId should be a valid UUID',
        }),
        checkInDate: Joi.number().integer().greater(0).optional().messages({
            'number.base': 'checkInDate should be a valid integer',
            'number.empty': 'checkInDate cannot be empty',
            'number.integer': 'checkInDate should be an integer',
            'number.greater': 'checkInDate should be a positive number',
        }),
        checkOutDate: Joi.number().integer().greater(Joi.ref('checkInDate')).optional().messages({
            'number.base': 'checkOutDate should be a valid integer',
            'number.empty': 'checkOutDate cannot be empty',
            'number.integer': 'checkOutDate should be an integer',
            'number.greater': 'checkOutDate should be greater than checkInDate',
        }),
    }).min(1);

    const { error } = reservationSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

export { validatePostReservation, validatePutReservation };