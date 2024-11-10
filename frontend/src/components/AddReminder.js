import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddReminder.css'; // Importing the CSS file
import Nav from './Nav';
import Footer from './Footer';
function AddReminder() {
  const [reminder, setReminder] = useState({
    reminderType: '',
    description: '',
    days: '',
    time: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReminder({ ...reminder, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder),
      });

      if (!response.ok) throw new Error('Failed to add reminder');

      setSuccessMessage('Reminder added successfully!');
      setReminder({
        reminderType: '',
        description: '',
        days: '',
        time: ''
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setSuccessMessage('Failed to add reminder. Please try again.');
    }
  };

  return (
    <div>
      <Nav/>
    <div className="add-reminder-container">
      <h2 className="add-reminder-title">Add New Reminder</h2>

      {/* Success/Error Message */}
      {successMessage && (
        <div
          className={`add-reminder-message ${
            successMessage.includes('successfully') ? 'success' : 'error'
          }`}
        >
          {successMessage}
        </div>
      )}

      <form className="add-reminder-form" onSubmit={handleSubmit}>
        {/* Reminder Type Input */}
        <div className="form-group">
          <label htmlFor="reminderType">Reminder Type:</label>
          <input
            type="text"
            name="reminderType"
            value={reminder.reminderType}
            onChange={(e) => {
              const input = e.target.value;
              // Regular expression to allow only letters and spaces
              const isValid = /^[A-Za-z\s]*$/.test(input);
              if (isValid) {
                handleChange(e); // Update the state only if valid
              } else {
                alert("Please enter text only. Numbers or special characters are not allowed.");
              }
            }}
            required
            placeholder="E.g., Medicine, Checkup"
            className="form-input"
          />
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            value={reminder.description}
            onChange={handleChange}
            required
            placeholder="E.g., Take your meds, Attend doctor appointment"
            className="form-input"
          />
        </div>

        {/* Days Input */}
        <div className="form-group">
          <label htmlFor="days">Day:</label>
          <input
            type="date"
            name="days"
            value={reminder.days}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
            className="form-input"
          />
        </div>

        {/* Time Input */}
        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            name="time"
            value={reminder.time}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">Add Reminder</button>
      </form>
    </div>
    <Footer/>
    </div>
  );
}

export default AddReminder;
