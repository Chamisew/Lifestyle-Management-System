const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nameValidationRegex = /^[A-Za-z\s]+$/;

const ReminderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a 'User' model
        required: true,
      },
    event: { 
        type: String,
        enum: ['Birthdays', 'Anniversaries', 'Memorial Dates', 'Other special events'],
        required: true
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value >= new Date();
            },
            message: 'Date cannot be in the past.'
        }
    },
    time: { type: String, required: true },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        validate: {
            validator: function(value) {
                return nameValidationRegex.test(value);
            },
            message: 'Name can only contain letters and spaces.'
        }
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    address: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 100
    },
    wish: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    }
}, { timestamps: true });

module.exports = mongoose.model('ReminderSchema', ReminderSchema);


