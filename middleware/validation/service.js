import Joi from 'joi';

const validatePostService = (req, res, next) => {
    const serviceSchema = Joi.object({
            hotelId: Joi.string().uuid().required().messages({
                'string.base': 'hotelId should be a string',
                'string.empty': 'hotelId cannot be empty',
                'string.uuid': 'hotelId should be a valid UUID',
                'any.required': 'hotelId is required',
            }),
            serviceName: Joi.string().min(3).max(100).required().messages({
                'string.base': 'serviceName should be a string',
                'string.empty': 'serviceName cannot be empty',
                'string.min': 'serviceName should have at least {#limit} characters',
                'string.max': 'serviceName should not exceed {#limit} characters',
                'any.required': 'serviceName is required',
            }),
            price: Joi.number().positive().precision(2).required().messages({
                'number.base': 'price should be a number',
                'number.positive': 'price must be a positive number',
                'number.empty': 'price cannot be empty',
                'any.required': 'price is required',
            }),
            description: Joi.string().min(5).max(255).required().messages({
                'string.base': 'description should be a string',
                'string.empty': 'description cannot be empty',
                'string.min': 'description should have at least {#limit} characters',
                'string.max': 'description should not exceed {#limit} characters',
                'any.required': 'description is required',
            }),
        });
        const { error } = serviceSchema.validate(req.body);

        if(error) {
            return res.status(409).json({
                message: error.details[0].message,
            });
        }

    next();
    };

    const validatePutService = (req, res, next) => {
        const serviceSchema = Joi.object({
            serviceName: Joi.string().min(3).max(100).optional().messages({
                'string.base': 'serviceName should be a string',
                'string.empty': 'serviceName cannot be empty',
                'string.min': 'serviceName should have at least {#limit} characters',
                'string.max': 'serviceName should not exceed {#limit} characters',
            }),
            price: Joi.number().positive().precision(2).optional().messages({
                'number.base': 'price should be a number',
                'number.positive': 'price must be a positive number',
                'number.empty': 'price cannot be empty',
            }),
            description: Joi.string().min(5).max(255).optional().messages({
                'string.base': 'description should be a string',
                'string.empty': 'description cannot be empty',
                'string.min': 'description should have at least {#limit} characters',
                'string.max': 'description should not exceed {#limit} characters',
            }),
        }).min(1);

        const { error } = serviceSchema.validate(req.body);

        if (error) {
            return res.status(409).json({
                message: error.details[0].message,
            });
        }

        next();
    };

    export { validatePostService, validatePutService };