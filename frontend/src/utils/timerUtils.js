// src/utils/timerUtils.js
export const calculateTimeRemaining = (reminder) => {
    const now = new Date();
    const reminderDate = new Date(reminder.date); // Ensure 'date' is in ISO 8601 format

    console.log('Current Date:', now);
    console.log('Reminder Date:', reminderDate);

    const totalMilliseconds = reminderDate - now;
    if (totalMilliseconds <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Timer has elapsed
    }

    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
};
