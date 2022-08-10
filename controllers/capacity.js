const { isEmpty } = require('lodash');
const moment = require('moment');

const Capacity = require('../models/capacity');
const AppError = require('../utils/appError');
const { DATE_FORMAT } = require('../utils/constants');
const { getTodaysDate } = require('../utils/helper');

const getCapacity = async (date) => {
    let capacity = await Capacity.findOne({ date });

    if (isEmpty(capacity)) {
        const today = moment(getTodaysDate(), DATE_FORMAT);

        // prevent capacity creation for past date
        if (moment(date, DATE_FORMAT).isBefore(today)) {
            throw new AppError('Capacity not found', 404);
        }

        capacity = await Capacity.create({
            date,
            maxCapacity: process.env.MAX_CAPACITY,
            quantityLeft: process.env.MAX_CAPACITY,
        });
    }

    return capacity.toJSON();
};

const updateQuantity = async (updates) => {
    const { date, ...rest } = updates;

    const updatedCapacity = await Capacity.findOneAndUpdate({ date }, rest, { new: true });

    if (!updatedCapacity) {
        throw new AppError('No capacity found', 401);
    }

    return updatedCapacity;
};

module.exports = {
    getCapacity,
    updateQuantity,
};
