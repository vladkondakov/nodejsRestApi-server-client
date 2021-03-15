const { signUpSchema, loginSchema, employeeSchema } = require('../helpers/validation-schema');
const ApiError = require('../error/apierror');

exports.authValidation = async function (req, res, next) {
    const schema = (req.originalUrl === '/auth/signup') ? signUpSchema : loginSchema;
    const userData = req.body.userData;
    await schema.validateAsync(userData)
        .then(() => {
            return next();
        })
        .catch((e) => {
            const err = ApiError.badRequest(`The data entered is not valid: ${e.message}`);
            return next(err);
        });
}

exports.employeeValidation = async function (req, res, next) {
    const employee = req.body;
    await employeeSchema.validateAsync(employee)
        .then(() => {
            return next();
        })
        .catch((e) => {
            const err = ApiError.badRequest(`The data entered is not valid: ${e.message}`);
            return next(err);
        });
}