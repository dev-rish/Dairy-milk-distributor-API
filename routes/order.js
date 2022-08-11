const { Router } = require('express');
const { isNumber, has: hasProperty } = require('lodash');

const { createOrder, updateOrder, getOrder, deleteOrder } = require('../controllers/order');
const AppError = require('../utils/appError');
const { ORDER_STATUSES } = require('../utils/constants');
const { getTodaysDate } = require('../utils/helper');
const wrapHandler = require('../utils/wrapHandler');

const router = Router();

router.get('/get/:orderId', wrapHandler(async (req) => {
    const { orderId } = req.params;

    const order = await getOrder(orderId);

    return { statusCode: 201, ...order };
}));

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
    const updates = req.body;

    if (hasProperty(updates, 'status') || hasProperty(updates, 'quantity')) {
        throw new AppError('Quantity or status update not allowed', 401);
    }

    const updatedOrder = await updateOrder({ orderId, ...updates });

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
