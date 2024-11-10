const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    due_date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Ensure it references the User model correctly
    },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
