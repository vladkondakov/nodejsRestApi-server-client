const ApiError = require("./apierror");

function apiErrorHandler(err, req, res, next) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }

    if (!(err instanceof ApiError)) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }

    return res.status(err.statusCode).send(err.payload);
}

module.exports = apiErrorHandler;