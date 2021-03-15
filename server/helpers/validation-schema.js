const Joi = require('joi');

const signUpSchema = Joi.object().keys({
    username: Joi.string().pattern(/^\w+$/).required(),
    password: Joi.string().pattern(/^\w+$/).min(3).max(16).required(),
    confirmationPassword: Joi.any().valid(Joi.ref('password')).required(),
    name: Joi.string().pattern(/^[a-zA-z]+$/).min(1).max(100).allow(''),
    surname: Joi.string().alphanum().min(1).max(100).allow(''),
    dateOfBirth: Joi.date().greater('1-1-1940').iso().allow(''),
    position: Joi.array().valid('Junior Software Engineer', 'Software Engineer', 'Junior Backend Developer').allow(''),
    salary: Joi.number().min(0).allow('')
});

const loginSchema = Joi.object().keys({
    username: Joi.string().pattern(/^\w+$/).required(),
    password: Joi.string().pattern(/^\w+$/).min(3).max(16).required()
});

const employeeSchema = Joi.object().keys({
    name: Joi.string().pattern(/^[a-zA-z]+$/).min(1).max(100).allow(''),
    surname: Joi.string().alphanum().min(1).max(100).allow(''),
    dateOfBirth: Joi.date().greater('1-1-1940').iso().allow(''),
    position: Joi.array().valid('Junior Software Engineer', 'Software Engineer', 'Junior Backend Developer').allow(''),
    salary: Joi.number().min(0).allow('')
});

module.exports = {
    signUpSchema,
    loginSchema,
    employeeSchema
}