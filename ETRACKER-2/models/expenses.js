

const mongoose = require('mongoose');
const { Schema } = mongoose;

const expensesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    pmethod: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Expenses', expensesSchema);
