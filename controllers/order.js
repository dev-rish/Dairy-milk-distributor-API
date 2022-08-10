const { isEmpty } = require('lodash');
const moment = require('moment');
const { generate: generateOrderId } = require('order-id')(
    process.env.ORDER_ID_KEY,
);

const Order = require('../models/order');
const AppError = require('../utils/appError');

const { DATE_FORMAT } = require('../utils/constants');
const { getCapacity, updateQuantity } = require('./capacity');

const getOrder = async (orderId) => {
    const order = await Order.findOne({ orderId });

    if (isEmpty(order)) {
        throw new AppError('Order not found', 404);
    }

    return order.toJSON();
};

const createOrder = async (quantity) => {
    const today = moment().format(DATE_FORMAT);

    const capacity = await getCapacity(today);

    if (capacity.quantityLeft < quantity) {
        throw new AppError('Insufficient capacity', 401);
    }

    await updateQuantity(today, capacity.quantityLeft - quantity);

    const createdOrder = await Order.create({
        orderDate: today,
        orderId: generateOrderId(),
        quantity,
    });

    return createdOrder.toJSON();
};

const updateOrder = async (order) => {
    const { orderId, ...updates } = order;

    const updatedOrder = await Order.findOneAndUpdate({ orderId }, updates, { new: true });

    if (isEmpty(updatedOrder)) {
        throw new AppError('Order not found', 404);
    }

    return updatedOrder.toJSON();
};

module.exports = {
    createOrder,
    updateOrder,
    getOrder,
};
