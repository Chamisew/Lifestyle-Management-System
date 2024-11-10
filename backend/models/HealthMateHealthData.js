const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120,
  },
  type: {
    type: String,
    required: true,
    enum: ['blood pressure', 'diabetes'], // Type selection: either blood pressure or diabetes
  },
  readings: [
    {
      day: { type: Number, required: true }, // Day of the week (1-7)
      value1: { type: Number, required: true }, // Either systolic or diabetes value
      value2: { type: Number }, // Optional: diastolic for blood pressure, or leave null for diabetes
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('HealthData', healthDataSchema);
