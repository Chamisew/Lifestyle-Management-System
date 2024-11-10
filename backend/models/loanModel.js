const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    totalAmount: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
}, {
    timestamps: true
});

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;
