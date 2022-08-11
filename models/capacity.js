const { Schema, model } = require('mongoose');

const capacitySchema = new Schema({
    date: {
        type: String,
        required: [true, 'Date is required'],
        unique: true,
        index: true,
    },
    maxCapacity: {
        type: Number,
        required: [true, 'Capacity is required'],
    },
    quantityLeft: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity should be atleast 0'],
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit Price is required'],
        min: [1, 'Unit price should be atleast 1'],
    },
});

const Capacity = model('Capacity', capacitySchema);

module.exports = Capacity;
