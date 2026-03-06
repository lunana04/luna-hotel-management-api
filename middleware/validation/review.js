import Joi from 'joi';

const validatePostReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        guestId: Joi.string().uuid().required().messages({
            'string.base': 'guestId should be a string',
            'string.empty': 'guestId cannot be empty',
            'string.uuid': 'guestId should be a valid UUID',
            'any.required': 'guestId is required',
        }),
        hotelId: Joi.string().uuid().required().messages({
            'string.base': 'hotelId should be a string',
            'string.empty': 'hotelId cannot be empty',
            'string.uuid': 'hotelId should be a valid UUID',
            'any.required': 'hotelId is required',
        }),
        rating: Joi.number().min(1).max(5).required().messages({
            'number.base': 'rating should be a number',
            'number.min': 'rating must be at least {#limit}',
            'number.max': 'rating must be at most {#limit}',
            'number.empty': 'rating cannot be empty',
            'any.required': 'rating is required',
        }),
        comment: Joi.string().min(5).max(500).required().messages({
            'string.base': 'comment should be a string',
            'string.empty': 'comment cannot be empty',
            'string.min': 'comment should have at least {#limit} characters',
            'string.max': 'comment should not exceed {#limit} characters',
            'any.required': 'comment is required',
        }),
    });
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

const validatePutReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        guestId: Joi.string().uuid().optional().messages({
            'string.base': 'guestId should be a string',
            'string.empty': 'guestId cannot be empty',
            'string.uuid': 'guestId should be a valid UUID',
        }),
        hotelId: Joi.string().uuid().optional().messages({
            'string.base': 'hotelId should be a string',
            'string.empty': 'hotelId cannot be empty',
            'string.uuid': 'hotelId should be a valid UUID',
        }),
        rating: Joi.number().min(1).max(5).optional().messages({
            'number.base': 'rating should be a number',
            'number.min': 'rating must be at least {#limit}',
            'number.max': 'rating must be at most {#limit}',
            'number.empty': 'rating cannot be empty',
        }),
        comment: Joi.string().min(5).max(500).optional().messages({
            'string.base': 'comment should be a string',
            'string.empty': 'comment cannot be empty',
            'string.min': 'comment should have at least {#limit} characters',
            'string.max': 'comment should not exceed {#limit} characters',
        }),
    }).min(1);

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        return res.status(409).json({
            message: error.details[0].message,
        });
    }

    next();
};

export { validatePostReview, validatePutReview };