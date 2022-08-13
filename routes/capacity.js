const { Router } = require('express');
const moment = require('moment');

const { getCapacity, updateCapacityDetails } = require('../controllers/capacity');
const AppError = require('../utils/appError');
const { DATE_FORMAT } = require('../utils/constants');
const { isValidDate } = require('../utils/helper');
const wrapHandler = require('../utils/wrapHandler');

const router = Router();

/**
 * @swagger
 * /api/capacity/checkCapacity/{date}:
 *      get:
 *          summary: The details like capacity, quantity left and the unit price (per litre) for that date.
 *                   New details are created if not already if date is current or future.
 *          parameters:
 *              - in: path
 *                name: date
 *                schema:
 *                      type: string
 *                description: Date with format DD-MM-YYYY
 *                required: true
 *          responses:
 *              200:
 *                  description: The capacity object
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
 *                                      $ref: '#/components/schemas/Capacity'
 *              404:
 *                  description: Capacity not found
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
router.get('/checkCapacity/:date', wrapHandler(async (req) => {
    const { date } = req.params;

    if (!isValidDate(date)) {
        throw new AppError('Invalid Date', 401);
    }
    const capacity = await getCapacity(date);

    return { statusCode: 200, ...capacity };
}));

/**
 * @swagger
 * /api/capacity/updateCapacity/{date}:
 *      get:
 *          summary: Update capcity details. Updating quantity left & unit price (per litre) is supported.
 *          parameters:
 *              - in: path
 *                name: date
 *                schema:
 *                      type: string
 *                description: Date with format DD-MM-YYYY
 *                required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              quantityLeft:
 *                                  type: number
 *                              unitPrice:
 *                                  type: number
 *          responses:
 *              200:
 *                  description: The updated capacity details object
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
 *                                      $ref: '#/components/schemas/Capacity'
 *              404:
 *                  description: Capacity not found
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
router.patch('/updateCapacity/:date', wrapHandler(async (req) => {
    const { date } = req.params;
    const { quantityLeft, unitPrice } = req.body;

    const today = moment();

    // prevent capacity updates for past dates
    if (moment(date, DATE_FORMAT, true).isBefore(today, 'date')) {
        throw new AppError('Invalid Date', 401);
    }
    const capacity = await updateCapacityDetails({ date, quantityLeft, unitPrice });

    return { statusCode: 200, ...capacity };
}));

module.exports = router;
