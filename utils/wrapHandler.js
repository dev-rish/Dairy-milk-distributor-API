/**
 * This wrapper is responsible for formatting response and catching errors
 * @param {Function} fn
 * @returns {Function}
 */
module.exports = (fn) => (req, res, next) => fn(req, res, next).then((data) => {
    const { statusCode = 200, ...rest } = data;
    res.status(statusCode).send({ status: 'success', data: rest });
}).catch(next);
