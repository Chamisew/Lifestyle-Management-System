const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payreminderSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  phonenumber: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Reminder = mongoose.model('payreminderSchema', payreminderSchema);

module.exports = Reminder;
