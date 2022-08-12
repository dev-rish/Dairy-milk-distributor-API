const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *      schemas:
 *          Capacity:
 *              type: object
 *              properties:
 *                  date:
 *                      type: string
 *                      nullable: false
 *                  maxCapacity:
 *                      type: number
 *                      nullable: false
 *                      description: Maximum capacity for that date
 *                  quantityLeft:
 *                      type: number
 *                      nullable: false
 *                      description: Amount of milk left on that date
 *                  unitPrice:
 *                      type: number
 *                      nullable: false
 *                      description: Price of milk per unit quantity i.e. litre(s)
 *              example:
 *                  _id: 92e4f4405d4e11acd429b810
 *                  date: 27-08-2022
 *                  maxCapacity: 1000
 *                  quantityLeft: 997.5
 *                  unitPrice: 70
 *                  __v: 0
 */
const capacitySchema = new Schema({
    date: {
        type: String,
        required: [true, 'Valid date is required'],
        unique: true,
        index: true,
    },
    maxCapacity: {
        type: Number,
        required: [true, 'Valid capacity is required'],
    },
    quantityLeft: {
        type: Number,
        required: [true, 'Valid quantity is required'],
        min: [0, 'Quantity should be atleast 0'],
    },
    unitPrice: {
        type: Number,
        required: [true, 'Valid unit price is required'],
        min: [1, 'Unit price should be atleast 1'],
    },
});

const Capacity = model('Capacity', capacitySchema);

module.exports = Capacity;
