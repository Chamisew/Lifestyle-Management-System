const mongoose = require("mongoose");

const SavingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Add this line
  amount: { type: Number, required: true },
  targetDate: { type: Date, required: true },
  amountLeft: { type: Number, required: true },
  description: { type: String, required: true },
  photo: { type: String },
});

module.exports = mongoose.model("Saving", SavingSchema);
