const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  budgetName: { type: String, required: true },
  expenses: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
