const Queue = require('bull');
const {
  checkUpcomingReminderAutoAssist,
  checkUpcomingEvents,
} = require('./reminderService');

// Initialize the reminder queue
const reminderQueue = new Queue('reminders', {
  redis: {
    maxRetriesPerRequest: 1000000, // Reasonable number of retries per request
    connectTimeout: 10000, // 10 seconds timeout
  },
})

// Process the reminder queue
reminderQueue.process(async (job) => {
  console.log("Processing reminder job...");

  try {
    await checkUpcomingReminderAutoAssist(); 
    await checkUpcomingEvents();
  } catch (error) {
    console.error("Error processing reminder job:", error.message);
  }
});

// Function to schedule the job
const scheduleReminderJob = async () => {
  await reminderQueue.add({}, { repeat: { cron: '37 16 * * *' } });
};

// Export the scheduling function
module.exports = {
  scheduleReminderJob,
};
