const { Schema, model } = require('mongoose');
const { ORDER_STATUSES } = require('../utils/constants');

const orderSchema = new Schema({
    orderDate: {
        type: String,
        required: [true, 'Valid order date is required'],
    },
    deliveryDate: {
        type: String,
        default: null,
    },
    orderId: {
        type: String,
        required: [true, 'Valid order ID is required'],
        unique: true,
        index: true,
    },
    quantity: {
        type: Number,
        required: [true, 'Valid quantity is required'],
        min: [1, 'Quantity should be atleast 1'],
    },
    status: {
        type: String,
        enum: Object.values(ORDER_STATUSES),
        required: [true, 'Valid order status is required'],
        default: ORDER_STATUSES.PLACED,
    },
    address: {
        type: String,
        required: [true, 'Valid address is required'],
    },
    totalPrice: {
        type: Number,
        required: [true, 'Valid price is required'],
    },
});

const Order = model('Order', orderSchema);

module.exports = Order;
