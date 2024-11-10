const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the work schema
const workSchema = new Schema({
    workId: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: [true, 'Work description is required.'],
        minlength: [5, 'Description must be at least 5 characters long.'],
        maxlength: [200, 'Description cannot exceed 200 characters.']
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required.']
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required.'],
        validate: {
            validator: function(value) {
                return value > this.startTime;
            },
            message: 'End time must be after start time.'
        }
    }
});

// Define the schedule schema
const scheduleSchema = new Schema({
    user: { // Reference to the user
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Ensure this matches your User model
    },
    date: {
        type: Date,
        required: [true, 'Date is required.'],
        validate: {
            validator: function(value) {
                // Ensure the date is not in the past
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return value >= today;
            },
            message: 'Date cannot be in the past.'
        }
    },
    works: {
        type: [workSchema],
        validate: {
            validator: function(works) {
                const workIds = works.map(work => work.workId);
                return workIds.length === new Set(workIds).size;
            },
            message: 'Work IDs must be unique within the schedule.'
        }
    }
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('MeetSchedule', scheduleSchema);
