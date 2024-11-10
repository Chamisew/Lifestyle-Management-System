const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assuming you have a User model for authentication
    },
}, {
    timestamps: true,
});

const Vehicle = mongoose.model('vehicleSchema', vehicleSchema);

module.exports = Vehicle;
