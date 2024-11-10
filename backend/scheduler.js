const cron = require('node-cron');
const { updateGoalCompletionStatus } = require('./controllers/goalController');

// Schedule the task to run every minute
cron.schedule('* * * * *', async () => {
  console.log('Running scheduled task to update goal completion status...');
  try {
    await updateGoalCompletionStatus();
    console.log('Scheduled task completed.');
  } catch (error) {
    console.error('Error during scheduled task:', error);
  }
});
