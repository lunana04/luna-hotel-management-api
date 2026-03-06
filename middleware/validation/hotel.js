import Joi from 'joi';

const validatePostHotel = (req, res, next) => {
    const hotelSchema = Joi.object({
        name: Joi.string().min(3).max(100).required().messages({
            'string.base': 'name should be a string',
            'string.empty': 'name cannot be empty',
            'string.min': 'name should have a minimum length of {#limit}',
            'string.max': 'name should have a maximum length of {#limit}',
            'any.required': 'name is required',
        }),
        location: Joi.string().min(3).max(100).required().messages({
            'string.base': 'location should be a string',
            'string.empty': 'location cannot be empty',
            'string.min': 'location should have a minimum length of {#limit}',
            'string.max': 'location should have a maximum length of {#limit}',
            'any.required': 'location is required',
        }),
        starRating: Joi.number().min(0).max(5).precision(1).required().messages({
            'number.base': 'starRating should be a number',
            'number.min': 'starRating cannot be less than {#limit}',
            'number.max': 'starRating cannot be more than {#limit}',
            'number.empty': 'starRating cannot be empty',
            'any.required': 'starRating is required',
        }),
        phoneNumber: Joi.string().min(10).max(13).pattern(/^\+?[0-9\s\-().]{7,20}$/).required().messages({
            'string.base': 'phoneNumber should be a string',
            'string.empty': 'phoneNumber cannot be empty',
            'string.min': 'phoneNumber should have a minimum length of {#limit}',
            'string.max': 'phoneNumber should have a maximum length of {#limit}',
            'string.pattern.base': 'phoneNumber format is invalid',
            'any.required': 'phoneNumber is required',
        }),
    });
    const { error } = hotelSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

const validatePutHotel = (req, res, next) => {
    const hotelSchema = Joi.object({
        name: Joi.string().min(3).max(100).optional().messages({
            'string.base': 'name should be a string',
            'string.empty': 'name cannot be empty',
            'string.min': 'name should have a minimum length of {#limit}',
            'string.max': 'name should have a maximum length of {#limit}',
        }),
        location: Joi.string().min(3).max(100).optional().messages({
            'string.base': 'location should be a string',
            'string.empty': 'location cannot be empty',
            'string.min': 'location should have a minimum length of {#limit}',
            'string.max': 'location should have a maximum length of {#limit}',
        }),
        starRating: Joi.number().min(0).max(5).precision(1).optional().messages({
            'number.base': 'starRating should be a number',
            'number.min': 'starRating cannot be less than {#limit}',
            'number.max': 'starRating cannot be more than {#limit}',
            'number.empty': 'starRating cannot be empty',
        }),
        phoneNumber: Joi.string().min(3).max(100).optional().messages({
            'string.base': 'phoneNumber should be a string',
            'string.empty': 'phoneNumber cannot be empty',
            'string.min': 'phoneNumber should have a minimum length of {#limit}',
            'string.max': 'phoneNumber should have a maximum length of {#limit}',
        }),
    }).min(1);

    const { error } = hotelSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

export { validatePostHotel, validatePutHotel };