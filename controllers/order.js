const moment = require('moment');
const { generate: generateOrderId } = require('order-id')(
    process.env.ORDER_ID_KEY,
);

const Order = require('../models/order');
const AppError = require('../utils/appError');

const { DATE_FORMAT } = require('../utils/constants');
const { getCapacity, updateQuantity } = require('./capacity');

const createOrder = async (quantity) => {
    const today = moment().format(DATE_FORMAT);

    const capacity = await getCapacity(today);

    if (capacity.quantityLeft < quantity) {
        throw new AppError('Insufficient capacity', 401);
    }

    await updateQuantity(today, capacity.quantityLeft - quantity);

    const createdOrder = await Order.create({ date: today, orderId: generateOrderId(), quantity });

    return createdOrder;
};

module.exports = {
    createOrder,
};
