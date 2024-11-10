import React from 'react';
import './vehicleList.css';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format as DD/MM/YYYY
  };
  const ReminderList = ({ reminders, setCurrentReminder, deleteReminder }) => {
    return (
    
        <div className="vehicle-list-container1">
            <h2 className="vehicle-list-title">Your Reminders</h2>
        <ul className="vehicle-list">
            {reminders.map((reminder) => (
                <li className="vehicle-item" key={reminder._id}>
                    <span className="vehicle-details">
                    <ul className="vehicle-details-list">
                    <li><strong>Vehicle:</strong> {reminder.vehicleName?.brand} {reminder.vehicleName?.model}</li> 
                    <li><strong>Reminder Type:</strong> {reminder.reminderType}</li> 
                    <li><strong>Date:</strong> {formatDate(reminder.date)}</li>
                    <li><strong>Time:</strong> {reminder.appointedTime}</li>
                    </ul>
                    </span>
                    <div className="vehicle-actions">
                    <button className="edit-btn" onClick={() => setCurrentReminder(reminder)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteReminder(reminder._id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    </div>
    );
};

export default ReminderList;
