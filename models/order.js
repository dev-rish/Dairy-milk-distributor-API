const { Schema, model } = require('mongoose');
const { ORDER_STATUSES } = require('../utils/constants');

/**
 * @swagger
 * components:
 *      schemas:
 *          Order:
 *              type: object
 *              properties:
 *                  orderDate:
 *                      type: string
 *                      description: Date(DD-MM-YYYY) when order placed
 *                      nullable: false
 *                  deliveryDate:
 *                      type: string
 *                      description: Date(DD-MM-YYYY) when order delivered
 *                      nullable: true
 *                  orderId:
 *                      type: string
 *                      nullable: false
 *                  quantity:
 *                      type: number
 *                      nullable: false
 *                      description: Quantity of milk in litre(s)
 *                  status:
 *                      type: string
 *                      enum: [PLACED, PACKED, DISPATCHED, DELIVERED]
 *                      nullable: false
 *                      description: Status of order
 *                  address:
 *                      type: string
 *                      nullable: false
 *                      description: Address of user who placed order
 *                  totalPrice:
 *                      type: number
 *              example:
 *                  _id: 92f4f7405d4e00aca429b910
 *                  orderDate: 27-08-2022
 *                  deliveryDate: null
 *                  orderId: 5003-663000-4099
 *                  quantity: 2.5
 *                  status: PLACED
 *                  address: Bangalore, India
 *                  totalPrice: 175
 *                  __v: 0
 */
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
