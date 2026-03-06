import Joi from 'joi';

const RoomStatus = ['RESERVED', 'PENDING', 'AVAILABLE'];
const RoomType = ['SINGLE', 'DOUBLE', 'SUITE'];
const validatePostRoom = (req, res, next) => {
    const roomSchema = Joi.object({
        roomType: Joi.string().valid(...RoomType).required().messages({
            'any.only': `roomType must be one of: ${RoomType.join(', ')}`,
            'string.base': 'roomType should be a string',
            'string.empty': 'roomType cannot be empty',
            'any.required': 'roomType is required',
        }),
        pricePerNight: Joi.number().positive().precision(2).required().messages({
            'number.base': 'pricePerNight should be a number',
            'number.positive': 'pricePerNight must be a positive value',
            'number.empty': 'pricePerNight cannot be empty',
            'any.required': 'pricePerNight is required',
        }),
        availabilityStatus: Joi.string().valid(...RoomStatus).default('AVAILABLE').required().messages({
            'any.only': `availabilityStatus must be one of: ${RoomStatus.join(', ')}`,
            'string.base': 'availabilityStatus should be a string',
            'string.empty': 'availabilityStatus cannot be empty',
            'any.required': 'availabilityStatus is required',
        }),
    });
    const { error } = roomSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

const validatePutRoom = (req, res, next) => {
    const roomSchema = Joi.object({
        roomType: Joi.string().valid(...RoomType).optional().messages({
            'any.only': `roomType must be one of: ${RoomType.join(', ')}`,
            'string.base': 'roomType should be a string',
            'string.empty': 'roomType cannot be empty',
            'any.required': 'roomType is required',
        }),
        pricePerNight: Joi.number().positive().precision(2).optional().messages({
            'number.base': 'pricePerNight should be a number',
            'number.positive': 'pricePerNight must be a positive value',
            'number.empty': 'pricePerNight cannot be empty',
            'any.required': 'pricePerNight is required',
        }),
        availabilityStatus: Joi.string().valid(...RoomStatus).default('AVAILABLE').optional().messages({
            'any.only': `availabilityStatus must be one of: ${RoomStatus.join(', ')}`,
            'string.base': 'availabilityStatus should be a string',
            'string.empty': 'availabilityStatus cannot be empty',
            'any.required': 'availabilityStatus is required',
        }),
    }).min(1);

    const { error } = roomSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

export { validatePostRoom, validatePutRoom };