import Joi from 'joi';

const validatePostInventory = (req, res, next) => {
    const inventorySchema = Joi.object({
        hotelId: Joi.string().uuid().required().messages({
            'string.base': 'hotelId should be a string',
            'string.empty': 'hotelId cannot be empty',
            'string.uuid': 'hotelId should be a valid UUID',
            'any.required': 'hotelId is required',
        }),
        itemName: Joi.string().min(2).max(100).required().messages({
            'string.base': 'itemName should be a string',
            'string.empty': 'itemName cannot be empty',
            'string.min': 'itemName should have at least {#limit} characters',
            'string.max': 'itemName should not exceed {#limit} characters',
            'any.required': 'itemName is required',
        }),
        quantity: Joi.number().integer().min(0).required().messages({
            'number.base': 'quantity should be a number',
            'number.integer': 'quantity should be an integer',
            'number.min': 'quantity must be at least {#limit}',
            'any.required': 'quantity is required',
        }),
        pricePerItem: Joi.number().positive().precision(2).required().messages({
            'number.base': 'pricePerItem should be a number',
            'number.positive': 'pricePerItem must be a positive number',
            'number.empty': 'pricePerItem cannot be empty',
            'any.required': 'pricePerItem is required',
        }),
    });
    const { error } = inventorySchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

const validatePutInventory = (req, res, next) => {
    const inventorySchema = Joi.object({
        hotelId: Joi.string().uuid().optional().messages({
            'string.base': 'hotelId should be a string',
            'string.empty': 'hotelId cannot be empty',
            'string.uuid': 'hotelId should be a valid UUID',
            'any.required': 'hotelId is required',
        }),
        itemName: Joi.string().min(2).max(100).optional().messages({
            'string.base': 'itemName should be a string',
            'string.empty': 'itemName cannot be empty',
            'string.min': 'itemName should have at least {#limit} characters',
            'string.max': 'itemName should not exceed {#limit} characters',
            'any.required': 'itemName is required',
        }),
        quantity: Joi.number().integer().min(0).optional().messages({
            'number.base': 'quantity should be a number',
            'number.integer': 'quantity should be an integer',
            'number.min': 'quantity must be at least {#limit}',
            'any.required': 'quantity is required',
        }),
        pricePerItem: Joi.number().positive().precision(2).optional().messages({
            'number.base': 'pricePerItem should be a number',
            'number.positive': 'pricePerItem must be a positive number',
            'number.empty': 'pricePerItem cannot be empty',
            'any.required': 'pricePerItem is required',
        }),
    }).min(1);

    const { error } = inventorySchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

export { validatePostInventory, validatePutInventory };