const { Router } = require('express');
const moment = require('moment');

const { getCapacity, updateCapacityDetails } = require('../controllers/capacity');
const AppError = require('../utils/appError');
const { DATE_FORMAT } = require('../utils/constants');
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

router.patch('/updateCapacity/:date', wrapHandler(async (req) => {
    const { date } = req.params;
    const { quantityLeft, unitPrice } = req.body;

    const today = moment();

    // prevent capacity updates for past dates
    if (moment(date, DATE_FORMAT, true).isBefore(today, 'date')) {
        throw new AppError('Invalid Date', 401);
    }
    const capacity = await updateCapacityDetails({ date, quantityLeft, unitPrice });

    return { statusCode: 200, ...capacity };
}));

module.exports = router;
