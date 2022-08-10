const { Router } = require('express');
const { isNumber } = require('lodash');
const moment = require('moment');

const { createOrder, updateOrder, getOrder } = require('../controllers/order');
const AppError = require('../utils/appError');
const { ORDER_STATUSES, DATE_FORMAT } = require('../utils/constants');
const wrapHandler = require('../utils/wrapHandler');

const router = Router();

router.get('/getOrder/:orderId', wrapHandler(async (req) => {
    const { orderId } = req.params;

    const order = await getOrder(orderId);

    return { statusCode: 201, ...order };
}));

router.post('/add', wrapHandler(async (req) => {
    const { quantity } = req.body;

    if (!isNumber(quantity) || quantity <= 0) {
        throw new AppError('Invalid quantity', 401);
    }

    const order = await createOrder(quantity);

    return { statusCode: 201, ...order };
}));

router.patch('/update/:orderId', wrapHandler(async (req) => {
    const { orderId } = req.params;
    const { quantity } = req.body;

    // TODO: What all to be allowed for update??
}));

router.patch('/updateStatus/:orderId', wrapHandler(async (req) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!Object.values(ORDER_STATUSES).includes(status)) {
        throw new AppError('Invalid Status', 401);
    }

    const deliveryDate = status === ORDER_STATUSES.DELIVERED ? moment().format(DATE_FORMAT) : null;
    const updatedOrder = await updateOrder({
        orderId,
        status,
        deliveryDate,
    });

    return { statusCode: 204, ...updatedOrder };
}));

module.exports = router;
