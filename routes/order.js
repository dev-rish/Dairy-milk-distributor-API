const { Router } = require('express');
const { isNumber } = require('lodash');

const { createOrder } = require('../controllers/order');
const AppError = require('../utils/appError');
const wrapHandler = require('../utils/wrapHandler');

const router = Router();

router.get('/', (req, res) => res.send('Milk Distributer'));

router.post('/add', wrapHandler(async (req) => {
    const { quantity } = req.body;

    if (!isNumber(quantity) || quantity <= 0) {
        throw new AppError('Invalid quantity', 401);
    }

    const order = await createOrder(quantity);

    return { statusCode: 201, order };
}));

module.exports = router;
