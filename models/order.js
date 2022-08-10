const { Schema, model } = require('mongoose');
const { ORDER_STATUSES } = require('../utils/constants');

const orderSchema = new Schema({
    date: {
        type: String,
        required: [true, 'Date is required'],
    },
    orderId: {
        type: String,
        required: [true, 'Order Id is required'],
        unique: true,
        index: true,
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
    },
    status: {
        type: String,
        enum: Object.values(ORDER_STATUSES),
        required: [true, 'Order status is required'],
        default: ORDER_STATUSES.PLACED,
    },
});

const Order = model('Order', orderSchema);

module.exports = Order;
