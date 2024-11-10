const MeetSchedule = require('../models/MeetSheduleModel');

const addSchedule = async (req, res) => {
    const { date, works } = req.body;

    if (!date || !works) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Assign workId sequentially starting from 1
        const processedWorks = works.map((work, index) => ({
            ...work,
            workId: index + 1
        }));

        // Create a new schedule with the user's ID
        const schedule = new MeetSchedule({ 
            date, 
            works: processedWorks, 
            user: req.user.id // Associate schedule with the authenticated user
        });
        await schedule.save();
        res.status(201).json(schedule);
    } catch (error) {
        console.error('Error adding schedule:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getSchedules = async (req, res) => {
    try {
        // Fetch schedules for the authenticated user
        const schedules = await MeetSchedule.find({ user: req.user.id });
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getScheduleByDate = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }

    try {
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        const nextDay = new Date(dateObj);
        nextDay.setDate(nextDay.getDate() + 1);

        // Fetch schedules for the authenticated user on the specified date
        const schedules = await MeetSchedule.find({
            date: {
                $gte: dateObj,
                $lt: nextDay
            },
            user: req.user.id // Ensure the schedule belongs to the user
        });

        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedule by date:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        const { date, works } = req.body;

        if (!date || !works) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Assign workId sequentially starting from 1
        const processedWorks = works.map((work, index) => ({
            ...work,
            workId: index + 1
        }));

        // Find and update the schedule for the authenticated user
        const schedule = await MeetSchedule.findOneAndUpdate(
            { _id: scheduleId, user: req.user.id }, // Ensure the schedule belongs to the user
            { date, works: processedWorks },
            { new: true, runValidators: true }
        );

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found or you do not have permission to update it' });
        }

        res.status(200).json(schedule);
    } catch (error) {
        console.error('Error updating schedule:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        // Ensure the schedule belongs to the authenticated user
        const schedule = await MeetSchedule.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found or you do not have permission to delete it' });
        }
        res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    addSchedule,
    getSchedules,
    getScheduleByDate,
    updateSchedule,
    deleteSchedule
};
