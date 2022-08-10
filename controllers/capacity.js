const { isEmpty } = require('lodash');

const Capacity = require('../models/capacity');
const AppError = require('../utils/appError');

const getCapacity = async (date) => {
    let capacity = await Capacity.findOne({ date });

    if (isEmpty(capacity)) {
        capacity = await Capacity.create({
            date,
            maxCapacity: process.env.MAX_CAPACITY,
            quantityLeft: process.env.MAX_CAPACITY,
        });
    }

    return capacity;
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
