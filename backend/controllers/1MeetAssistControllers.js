// 1MeetAssistControllers.js
const Meet = require("../models/1MeetAssistModel");
const moment = require('moment');

function convertToDate(dateString, timeString) {
    const dateTimeString = `${dateString}T${timeString}`;
    return new Date(dateTimeString);
}

const getAllMeetings = async (req, res, next) => {
    let meetings;

    try {
        meetings = await Meet.find({ user: req.user.id }); // Fetch meetings for the authenticated user
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }

    if (!meetings.length) {
        return res.status(404).json({ message: "You have not any meetings." });
    }

    return res.status(200).json({ meetings });
};

const addMeet = async (req, res, next) => {
    const { name, date, startTime, endTime, location, participants, notes } = req.body;

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    
    let meeting;
    try {
        meeting = new Meet({ 
            name, 
            date, 
            startTime, 
            endTime, 
            location, 
            participants, 
            notes,
            user: req.user.id // Associate the meeting with the authenticated user
        });
        await meeting.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }

    return res.status(201).send({ message: "Meeting successfully added", meeting });
};

const getById = async (req, res, next) => {
    const id = req.params.id;
    let meeting;
    
    try {
        meeting = await Meet.findOne({ _id: id, user: req.user.id }); // Ensure the meeting belongs to the user
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }

    if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
    }
    
    return res.status(200).json({ meeting });
};

const updateMeeting = async (req, res, next) => {
    const id = req.params.id;
    const { name, date, startTime, endTime, location, participants, notes } = req.body;

    try {
        const meeting = await Meet.findOneAndUpdate(
            { _id: id, user: req.user.id }, // Ensure the meeting belongs to the user
            { name, date, startTime, endTime, location, participants, notes },
            { new: true, runValidators: true }
        );

        if (!meeting) {
            return res.status(404).json({ message: "Unable to update, meeting not found or you do not have permission." });
        }

        return res.status(200).json({ meeting });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const deleteMeeting = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const meeting = await Meet.findOneAndDelete({ _id: id, user: req.user.id }); // Ensure the meeting belongs to the user
        if (!meeting) {
            return res.status(404).json({ message: "Unable to cancel, meeting not found or you do not have permission." });
        }

        return res.status(200).json({ message: "Meeting successfully deleted" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllMeetings = getAllMeetings;
exports.addMeet = addMeet;
exports.getById = getById;
exports.updateMeeting = updateMeeting;
exports.deleteMeeting = deleteMeeting;
