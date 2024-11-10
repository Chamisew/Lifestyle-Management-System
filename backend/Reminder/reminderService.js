const cron = require('node-cron');
const {autoAssistReminderEmail,
       sendEventPlannerReminderEmail,
} = require("./mailer");

const User = require('../models/userModel');
const Reminder = require('../models/reminderModel');
const Event = require('../models/eventModel');


//Auto Assist
const checkUpcomingReminderAutoAssist = async (email, date) => {
  // Validate the input date
  const inputDate = new Date(date);
  if (isNaN(inputDate.getTime())) {
      throw new Error("Invalid date provided.");
  }

  // Set the start and end of the specified day
  const startOfDay = new Date(inputDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(inputDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
      const reminders = await Reminder.find({
          email, // Use the provided email to filter reminders
          date: {
              $gte: startOfDay,
              $lte: endOfDay,
          },
      });

      // Loop through reminders and send emails
      for (const reminder of reminders) {
          await autoAssistReminderEmail(email, {
              vehicleName: reminder.vehicleName,
              reminderType: reminder.reminderType,
              date: reminder.date.toString(),
              appointedTime: reminder.appointedTime,
              location: reminder.location,
              notes: reminder.notes || "No notes provided",
          });
      }
  } catch (error) {
      console.error("Failed to send Auto Assist reminders:", error.message);
  }
};
   

//EventPlanner
const checkUpcomingEvents = async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
  
    const nextDay = new Date(tomorrow);
    nextDay.setHours(23, 59, 59, 999);
  
    try {
      const users = await User.find();
  
      for (const user of users) {
        const events = await Event.find({
          userId: user._id, // Ensure you only get events for the current user
          date: {
            $gte: tomorrow,
            $lte: nextDay,
          },
        });
  
        for (const event of events) {
          await sendEventPlannerReminderEmail(user.email, {
            name: event.name,
            date: event.date.toString(),
            time: event.time,
            location: event.location,
            totalGuests: event.totalGuests,
            note: event.note || "No note provided",
          });
        }
      }
    } catch (error) {
      console.error("Failed to send event reminders:", error.message);
    }
  };
     
//meetAssist


//payTrack

//FinanceGuard

//eventMinder

//HealthMate

//ShopSmart

cron.schedule('37 16 * * *', () => {
  console.log("Checking for reminders...");
  checkUpcomingReminderAutoAssist ();
  checkUpcomingEvents();
});

module.exports = {
  checkUpcomingReminderAutoAssist,
  checkUpcomingEvents,
};
