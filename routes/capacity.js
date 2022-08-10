const { Router } = require('express');

const { getCapacity } = require('../controllers/capacity');
const AppError = require('../utils/appError');
const { isValidDate } = require('../utils/helper');
const wrapHandler = require('../utils/wrapHandler');

const router = Router();

router.get('/checkCapacity/:date', wrapHandler(async (req) => {
    const { date } = req.params;

    if (!isValidDate(date)) {
        throw new AppError('Invalid Date', 401);
    }
    const capacity = await getCapacity(date);

    return { statusCode: 200, ...capacity };
}));

module.exports = router;
