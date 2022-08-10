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
    },
});

const Capacity = model('Capacity', capacitySchema);

module.exports = Capacity;
