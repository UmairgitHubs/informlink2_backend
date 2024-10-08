import Joi from 'joi';



export const registerSchemaValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
});


export const LoginschemaValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});


