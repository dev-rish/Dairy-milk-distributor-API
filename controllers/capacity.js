const { isEmpty } = require('lodash');
const moment = require('moment');

const Capacity = require('../models/capacity');
const AppError = require('../utils/appError');
const { DATE_FORMAT } = require('../utils/constants');

const getCapacity = async (date) => {
    let capacity = await Capacity.findOne({ date });

    if (isEmpty(capacity)) {
        const today = moment();

        // prevent capacity creation for past date
        if (moment(date, DATE_FORMAT).isBefore(today, 'date')) {
            throw new AppError('Capacity Details not found', 404);
        }

        capacity = await Capacity.create({
            date,
            maxCapacity: process.env.MAX_CAPACITY,
            quantityLeft: process.env.MAX_CAPACITY,
            unitPrice: process.env.UNIT_PRICE,
        });
    }

    return capacity.toJSON();
};

const updateCapacityDetails = async (updates) => {
    const { date, ...rest } = updates;

    const updatedCapacity = await Capacity.findOneAndUpdate(
        { date },
        rest,
        { new: true, runValidators: true },
    );

    if (!updatedCapacity) {
        throw new AppError('Capacity Details not found', 401);
    }

    return updatedCapacity.toJSON();
};

module.exports = {
    getCapacity,
    updateCapacityDetails,
};
