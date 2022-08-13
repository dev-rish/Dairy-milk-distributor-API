const { Router } = require('express');
const { isNumber } = require('lodash');

const { createOrder, updateOrder, getOrder, deleteOrder } = require('../controllers/order');
const AppError = require('../utils/appError');
const { ORDER_STATUSES } = require('../utils/constants');
const { getTodaysDate } = require('../utils/helper');
const wrapHandler = require('../utils/wrapHandler');

const router = Router();

/**
 * @swagger
 * /api/order/get/{orderId}:
 *      get:
 *          summary: Gets order details given the order id
 *          parameters:
 *              - in: path
 *                name: orderId
 *                schema:
 *                      type: string
 *                required: true
 *          responses:
 *              200:
 *                  description: The order by id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: string
 *                                      default: 'success'
 *                                  data:
 *                                      type: object
 *                                      $ref: '#/components/schemas/Order'
 *              404:
 *                  description: Order not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: string
 *                                      default: 'fail'
 *                                  message:
 *                                      type: string
 *                                      default: 'Order not found'
 *              500:
 *                  description: Server error
 */
router.get('/get/:orderId', wrapHandler(async (req) => {
    const { orderId } = req.params;

    const order = await getOrder(orderId);

    return { statusCode: 200, ...order };
}));


/**
 * @swagger
 * /api/order/add:
 *      post:
 *          summary: Add new order
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              quantity:
 *                                  type: number
 *                                  default: 1
 *                              address:
 *                                  type: string
 *          responses:
 *              201:
 *                  description: Order added successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: string
 *                                      default: 'success'
 *                                  data:
 *                                      $ref: '#/components/schemas/Order'
 *              401:
 *                  description: Quantity not available
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: string
 *                                      default: 'fail'
 *                                  message:
 *                                      type: string
 *                                      default: 'Quantity not available'
 *              500:
 *                 description: Server error
 */
router.post('/add', wrapHandler(async (req) => {
    const { quantity, ...rest } = req.body;

    if (!isNumber(quantity)) {
        throw new AppError('Invalid quantity', 401);
    }

    const order = await createOrder({ quantity: quantity.toFixed(2), ...rest });

    return { statusCode: 201, ...order };
}));

router.patch('/update/:orderId', wrapHandler(async (req) => {
    const { orderId } = req.params;
    const { address } = req.body;

    const updatedOrder = await updateOrder({ orderId, address });

    return { statusCode: 200, ...updatedOrder };
}));

router.patch('/updateStatus/:orderId', wrapHandler(async (req) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!Object.values(ORDER_STATUSES).includes(status)) {
        throw new AppError('Invalid Status', 401);
    }

    const deliveryDate = status === ORDER_STATUSES.DELIVERED ? getTodaysDate() : null;
    const updatedOrder = await updateOrder({
        orderId,
        status,
        deliveryDate,
    });

    return { statusCode: 200, ...updatedOrder };
}));

router.delete('/delete/:orderId', wrapHandler(async (req) => {
    const { orderId } = req.params;

    const order = await deleteOrder(orderId);

    return { statusCode: 200, ...order };
}));

module.exports = router;
