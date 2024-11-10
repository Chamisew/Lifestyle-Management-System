// models/budgetModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const budgetSchema = new Schema({
  paymentType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set to current date if not provided
  },
  user: {  
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
