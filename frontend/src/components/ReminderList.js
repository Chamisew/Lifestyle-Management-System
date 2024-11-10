import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationPopup from './ConfirmationPopup'; // Import the new Popup component
import './ReminderList.css'; // Import the CSS file
import Nav from './Nav';
import Footer from './Footer';
function ReminderList() {
  const [reminders, setReminders] = useState([]);
  const [timers, setTimers] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch('http://localhost:5000/health');
        if (!response.ok) throw new Error('Failed to fetch reminders');
        const data = await response.json();
        setReminders(data);

        const initialTimers = {};
        data.forEach(reminder => {
          const reminderDate = new Date(`${reminder.days}T${reminder.time}`);
          initialTimers[reminder._id] = reminderDate - new Date();
        });
        setTimers(initialTimers);
      } catch (error) {
        setErrorMessage('Failed to fetch reminders.');
      }
    };

    fetchReminders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const updatedTimers = {};
        for (const id in prevTimers) {
          if (prevTimers[id] > 0) {
            updatedTimers[id] = prevTimers[id] - 1000;
          }
        }
        return updatedTimers;
      });

      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id) => {
    setReminderToDelete(id);
    setPopupVisible(true); // Show the popup
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/health/${reminderToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete reminder');

      setReminders(reminders.filter(reminder => reminder._id !== reminderToDelete));
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers };
        delete newTimers[reminderToDelete];
        return newTimers;
      });
    } catch (error) {
      setErrorMessage('Failed to delete reminder.');
    } finally {
      setPopupVisible(false); // Close the popup
    }
  };

  const cancelDelete = () => {
    setPopupVisible(false); // Close the popup
    setReminderToDelete(null); // Reset reminder to delete
  };

  const formatTimeRemaining = (time) => {
    if (time < 0) return "Reminder Expired"; // Display for expired reminders
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const upcomingRemindersCount = reminders.filter(reminder => {
    const reminderDate = new Date(`${reminder.days}T${reminder.time}`);
    return reminderDate >= new Date();
  }).length;

  return (
    <div>
      <Nav/>
    <div className="reminder-list-container">
      <h2 className="reminder-list-title">Your Reminder List</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p className="upcoming-count">
        You have <strong>{upcomingRemindersCount}</strong> upcoming reminders.
      </p>

      <p className="current-time">
        Current Time: {currentTime.toLocaleTimeString()}
      </p>

      <Link to="/add">
        <button className="add-reminder-button">Add New Reminder</button>
      </Link>

      <ul className="reminder-list">
        {reminders.map(reminder => (
          <li key={reminder._id} className="reminder-item">
            <div className="reminder-info">
              <span className="reminder-type">{reminder.reminderType}</span>
              <span className="reminder-description">{reminder.description}</span>
              <span className="time-remaining">Due in: {formatTimeRemaining(timers[reminder._id])}</span>
            </div>
            <div className="reminder-actions">
              <Link to={`/update/${reminder._id}`}>
                <button className="edit-button">Edit</button>
              </Link>
              <button
                className="delete-button"
                onClick={() => handleDelete(reminder._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isPopupVisible && (
        <ConfirmationPopup
          message="Are you sure you want to delete this reminder?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
    <Footer/>
    </div>
  );
}

export default ReminderList;
