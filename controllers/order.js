const { isEmpty } = require('lodash');
const { generate: generateOrderId } = require('order-id')(process.env.ORDER_ID_KEY);

const Order = require('../models/order');
const AppError = require('../utils/appError');

const { ORDER_STATUSES } = require('../utils/constants');
const { getTodaysDate } = require('../utils/helper');
const { getCapacity, updateCapacityDetails } = require('./capacity');

const getOrder = async (orderId) => {
    const order = await Order.findOne({ orderId });

    if (isEmpty(order)) {
        throw new AppError('Order not found', 404);
    }

    return order.toJSON();
};

const createOrder = async (orderDetails) => {
    const { quantity, ...rest } = orderDetails;

    const today = getTodaysDate();

    const { quantityLeft, unitPrice } = await getCapacity(today);

    if (quantityLeft < quantity) {
        throw new AppError('Quantity not available', 401);
    }

    const createdOrder = await Order.create({
        ...rest,
        orderDate: today,
        orderId: generateOrderId(),
        quantity,
        totalPrice: (quantity * unitPrice).toFixed(2),
    });

    await updateCapacityDetails({ date: today, $inc: { quantityLeft: -quantity } });

    return createdOrder.toJSON();
};

const updateOrder = async (orderDetails) => {
    const { orderId, ...updates } = orderDetails;

    const order = await getOrder(orderId);

    if (order.status === ORDER_STATUSES.DELIVERED) {
        throw new AppError('Delivered orders cannot be updated', 401);
    }

    const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        updates,
        { new: true, runValidators: true },
    );

    if (isEmpty(updatedOrder)) {
        throw new AppError('Order not found', 404);
    }

    return updatedOrder.toJSON();
};

const deleteOrder = async (orderId) => {
    const order = await getOrder(orderId);

    if (isEmpty(order)) {
        throw new AppError('Order not found', 404);
    }

    if (order.status === ORDER_STATUSES.DELIVERED) {
        throw new AppError('Delivered orders cannot be deleted', 401);
    }

    await Order.findOneAndDelete({ orderId });

    await updateCapacityDetails({ date: order.orderDate, $inc: { quantityLeft: order.quantity } });

    return order.toJSON();
};

module.exports = {
    createOrder,
    updateOrder,
    getOrder,
    deleteOrder,
};
