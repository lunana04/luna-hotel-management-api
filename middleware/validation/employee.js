import Joi from 'joi';

const validatePostEmployee = (req, res, next) => {
    const employeeSchema = Joi.object({
        firstName: Joi.string().min(3).max(100).required().messages({
            'string.base': 'firstName should be a string',
            'string.empty': 'firstName cannot be empty',
            'string.min': 'firstName should have a minimum length of {#limit}',
            'string.max': 'firstName should have a maximum length of {#limit}',
            'any.required': 'firstName is required',
        }),
        lastName: Joi.string().min(3).max(100).required().messages({
            'string.base': 'lastName should be a string',
            'string.empty': 'lastName cannot be empty',
            'string.min': 'lastName should have a minimum length of {#limit}',
            'string.max': 'lastName should have a maximum length of {#limit}',
            'any.required': 'lastName is required',
        }),
        position: Joi.string().valid('MANAGER', 'RECEPTIONIST', 'HOUSEKEEPING', 'SECURITY', 'OTHER').required().messages({
            'any.only': 'position must be one of: MANAGER, RECEPTIONIST, HOUSEKEEPING, SECURITY, OTHER',
            'string.base': 'position should be a string',
            'string.empty': 'position cannot be empty',
            'any.required': 'position is required',
        }),
        emailAddress: Joi.string().email().required().messages({
            'string.base': 'emailAddress should be a string',
            'string.empty': 'emailAddress cannot be empty',
            'string.email': 'emailAddress must be a valid email address',
            'any.required': 'emailAddress is required',
        }),
        phoneNumber: Joi.string().min(3).max(100).pattern(/^\+?[0-9\s\-().]{7,20}$/).required().messages({
            'string.base': 'phoneNumber should be a string',
            'string.empty': 'phoneNumber cannot be empty',
            'string.min': 'phoneNumber should have a minimum length of {#limit}',
            'string.max': 'phoneNumber should have a maximum length of {#limit}',
        }),
    });
    const { error } = employeeSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

const validatePutEmployee = (req, res, next) => {
    const employeeSchema = Joi.object({
        firstName: Joi.string().min(3).max(100).optional().messages({
            'string.base': 'firstName should be a string',
            'string.empty': 'firstName cannot be empty',
            'string.min': 'firstName should have a minimum length of {#limit}',
            'string.max': 'firstName should have a maximum length of {#limit}',
        }),
        lastName: Joi.string().min(3).max(100).optional().messages({
            'string.base': 'lastName should be a string',
            'string.empty': 'lastName cannot be empty',
            'string.min': 'lastName should have a minimum length of {#limit}',
            'string.max': 'lastName should have a maximum length of {#limit}',
        }),
        position: Joi.string().valid('MANAGER', 'RECEPTIONIST', 'HOUSEKEEPING', 'SECURITY', 'OTHER').optional().messages({
            'any.only': 'position must be one of: MANAGER, RECEPTIONIST, HOUSEKEEPING, SECURITY, OTHER',
            'string.base': 'position should be a string',
            'string.empty': 'position cannot be empty',
        }),
        emailAddress: Joi.string().email().optional().messages({
            'string.base': 'emailAddress should be a string',
            'string.empty': 'emailAddress cannot be empty',
            'string.email': 'emailAddress must be a valid email address',
        }),
        phoneNumber: Joi.string().min(3).max(100).pattern(/^\+?[0-9\s\-().]{7,20}$/).optional().messages({
            'string.base': 'phoneNumber should be a string',
            'string.empty': 'phoneNumber cannot be empty',
            'string.min': 'phoneNumber should have a minimum length of {#limit}',
            'string.max': 'phoneNumber should have a maximum length of {#limit}',
        }),
    }).min(1);

    const { error } = employeeSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

export { validatePostEmployee, validatePutEmployee };