import Joi from 'joi';

const validatePostGuest = (req, res, next) => {
    const guestSchema = Joi.object({
        firstName: Joi.string().min(3).max(100).required().messages({
            'string.base': 'first name should be a string',
            'string.empty': 'first name cannot be empty',
            'string.min': 'first name should have a minimum length of {#limit}',
            'string.max': 'first name should have a maximum length of {#limit}',
            'any.required': 'first name is required',
        }),
        lastName: Joi.string().min(3).max(100).required().messages({
            'string.base': 'last name should be a string',
            'string.empty': 'last name cannot be empty',
            'string.min': 'last name should have a minimum length of {#limit}',
            'string.max': 'last name should have a maximum length of {#limit}',
            'any.required': 'last name is required',
        }),
        emailAddress: Joi.string().min(3).max(100).email().required().messages({
            'string.base': 'email should be a string',
            'string.empty': 'email cannot be empty',
            'string.min': 'email should have a minimum length of {#limit}',
            'string.max': 'email should have a maximum length of {#limit}',
            'string.email': 'email must be a valid email address',
            'any.required': 'email is required',
        }),
        phoneNumber: Joi.string().min(10).max(13).pattern(/^\+[0-9\s\-().]{6,19}$/).required().messages({
            'string.base': 'phoneNumber should be a string',
            'string.empty': 'phoneNumber cannot be empty',
            'string.min': 'phoneNumber should have a minimum length of {#limit}',
            'string.max': 'phoneNumber should have a maximum length of {#limit}',
            'string.pattern.base': 'phoneNumber format is invalid',
            'any.required': 'phoneNumber is required',
        }),
    });
    const { error } = guestSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

const validatePutGuest = (req, res, next) => {
    const guestSchema = Joi.object({
        firstName: Joi.string().min(3).max(100).optional().messages({
            'string.base': 'first name should be a string',
            'string.empty': 'first name cannot be empty',
            'string.min': 'first name should have a minimum length of {#limit}',
            'string.max': 'first name should have a maximum length of {#limit}',
        }),
        lastName: Joi.string().min(3).max(100).optional().messages({
            'string.base': 'last name should be a string',
            'string.empty': 'last name cannot be empty',
            'string.min': 'last name should have a minimum length of {#limit}',
            'string.max': 'last name should have a maximum length of {#limit}',
        }),
        emailAddress: Joi.string().min(3).max(100).email().optional().messages({
            'string.base': 'email should be a string',
            'string.empty': 'email cannot be empty',
            'string.min': 'email should have a minimum length of {#limit}',
            'string.max': 'email should have a maximum length of {#limit}',
            'string.email': 'email must be a valid email address',
        }),
        phoneNumber: Joi.string().min(10).max(13).pattern(/^\+[0-9\s\-().]{6,19}$/).optional().messages({
            'string.base': 'phoneNumber should be a string',
            'string.empty': 'phoneNumber cannot be empty',
            'string.min': 'phoneNumber should have a minimum length of {#limit}',
            'string.max': 'phoneNumber should have a maximum length of {#limit}',
            'string.pattern.base': 'phoneNumber format is invalid',
        }),
    }).min(1);

    const { error } = guestSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

export { validatePostGuest, validatePutGuest };