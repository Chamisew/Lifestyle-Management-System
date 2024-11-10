//1MeetAssistModel.js
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const meetSchema=new Schema({

    name: {
        type: String,
        required: [true, 'Meeting name is required.'],
        minLength: [3, 'Meeting name must be at least 3 characters long.'],
        maxLength: [100, 'Meeting name cannot exceed 100 characters.']
    },
    date: {
        type: Date,
        required: [true, 'Meeting date is required.'],
        validate: {
            validator: function (value) {
                return value >= new Date();
            },
            message: 'Meeting date must be in the future.'
        }
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: [true, 'Meeting location is required.'],
        minLength: [3, 'Location must be at least 3 characters long.']
    },

    participants: {
         type: [String],
        required: [true, 'At least one participant is required.'],
        validate: {
            validator: function (participants) {
                return participants.length > 0;
            },
            message: 'Participants list cannot be empty.'
        }
    },
    notes: {
        type: String,
        required: false,
        maxLength: [500, 'Notes cannot exceed 500 characters.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // This field is required to associate meetings with users
    }
});

module.exports=mongoose.model(
    "1MeetAssistModel",meetSchema
)