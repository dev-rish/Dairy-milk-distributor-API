const AppError = require('./appError');

/**
 * Formats any error before sending to client
 * @param {Error} err
 * @returns {Object}
 */
const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

/**
 * Converts mongoose Validation Error to AppError i.e. strips out unneccessary details
 * before sending to client
 * @param {Error} err
 * @returns {AppError}
 */
const sendErrorProd = (err, req, res) => {
    const { isOperational, statusCode, status, message } = err;

    if (isOperational) {
        return res.status(statusCode).json({
            status,
            message,
        });
    }

    // eslint-disable-next-line no-console
    console.error('ERROR 🎇', err);

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
    });
};

/**
 * Converts mongoose mongoose ValidationError to AppError
 * @param {Error} err
 * @returns {AppError}
 */
const handleValidationError = (err) => {
    // Fetch error msg for various fields
    const errors = Object.values(err.errors).map((el) => el.message);
    // Combine all error msgs
    const message = `Invalid input data. ${errors.join('. ')}.`;
    return new AppError(message, 400);
};

/**
 * Converts mongoose mongoose CastError to AppError
 * @param {Function} fn
 * @returns {Function}
 */
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

/**
 * Its responsible to catch any errors thrown app wide and handle it accordingly
 * @param {Function} fn
 * @returns {Function}
 */
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        if (err.name === 'ValidationError') {
            err = handleValidationError(err);
        } else if (err.name === 'CastError') {
            err = handleCastError(err);
        }

        sendErrorProd(err, req, res);
    }
};
