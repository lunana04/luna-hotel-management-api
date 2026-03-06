import Joi from 'joi';

const validatePostUser = (req, res, next) => {
    const userSchema = Joi.object({
        firstName: Joi.string().min(2).max(50).required().messages({
            'string.base': 'firstName should be a string',
            'string.empty': 'firstName cannot be empty',
            'string.min': 'firstName should have at least {#limit} characters',
            'string.max': 'firstName should not exceed {#limit} characters',
            'any.required': 'firstName is required',
        }),
        lastName: Joi.string().min(2).max(50).required().messages({
            'string.base': 'lastName should be a string',
            'string.empty': 'lastName cannot be empty',
            'string.min': 'lastName should have at least {#limit} characters',
            'string.max': 'lastName should not exceed {#limit} characters',
            'any.required': 'lastName is required',
        }),
        emailAddress: Joi.string().email().required().messages({
            'string.base': 'emailAddress should be a string',
            'string.email': 'emailAddress must be a valid email',
            'string.empty': 'emailAddress cannot be empty',
            'any.required': 'emailAddress is required',
        }),
        password: Joi.string().min(8).max(100).required().messages({
            'string.base': 'password should be a string',
            'string.empty': 'password cannot be empty',
            'string.min': 'password should have a minimum length of {#limit}',
            'string.max': 'password should have a maximum length of {#limit}',
            'any.required': 'password is required',
        }),
        role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'NORMAL').optional().messages({
            'string.base': 'role should be a string',
            'any.only': 'role must be either ADMIN or NORMAL',
            'string.empty': 'role cannot be empty',
            'any.required': 'role is required',
        }),
    });
    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

const validatePutUser = (req, res, next) => {
    const userSchema = Joi.object({
        firstName: Joi.string().min(2).max(50).optional().messages({
            'string.base': 'firstName should be a string',
            'string.empty': 'firstName cannot be empty',
            'string.min': 'firstName should have at least {#limit} characters',
            'string.max': 'firstName should not exceed {#limit} characters',
        }),
        lastName: Joi.string().min(2).max(50).optional().messages({
            'string.base': 'lastName should be a string',
            'string.empty': 'lastName cannot be empty',
            'string.min': 'lastName should have at least {#limit} characters',
            'string.max': 'lastName should not exceed {#limit} characters',
        }),
        emailAddress: Joi.string().email().optional().messages({
            'string.base': 'emailAddress should be a string',
            'string.email': 'emailAddress must be a valid email',
            'string.empty': 'emailAddress cannot be empty',
        }),
    }).min(1);

    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

export { validatePostUser, validatePutUser };