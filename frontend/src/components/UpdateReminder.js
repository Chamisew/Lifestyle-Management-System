import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateReminder.css'; // Import the CSS file
import Nav from './Nav';
import Footer from './Footer';
function UpdateReminder() {
  const { id } = useParams();
  const [reminder, setReminder] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReminder = async () => {
      try {
        const response = await fetch(`http://localhost:5000/health/${id}`);
        if (!response.ok) throw new Error('Failed to fetch reminder');
        const data = await response.json();
        setReminder(data);
      } catch (error) {
        console.error('Failed to fetch reminder:', error);
      }
    };

    fetchReminder();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReminder({ ...reminder, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/health/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder),
      });

      if (!response.ok) throw new Error('Failed to update reminder');

      setSuccessMessage('Reminder updated successfully!');
      setTimeout(() => {
        navigate('/'); // Redirect after a short delay
      }, 2000);
    } catch (error) {
      setSuccessMessage('Failed to update reminder. Please try again.');
    }
  };

  if (!reminder) return <p>Loading...</p>;

  return (
    <div>
      <Nav/>
    <div className="update-reminder-container">
      {successMessage && (
        <p className={successMessage.includes('successfully') ? 'success-message' : 'error-message'}>
          {successMessage}
        </p>
      )}
      <h2 className="update-reminder-title">Update Reminder</h2>
      <form onSubmit={handleSubmit} className="update-reminder-form">
        <div>
          <label className="update-reminder-label">Reminder Type:</label>
          <input
            type="text" // Keep as text input
            name="reminderType"
            value={reminder.reminderType}
            onChange={(e) => {
              const input = e.target.value;
              const isValid = /^[A-Za-z\s'-]*$/.test(input);

              if (isValid) {
                handleChange(e); // Update the state only if valid
              } else {
                alert("Please enter a valid reminder type. Numbers or special characters are not allowed.");
              }
            }}
            required
            className="update-reminder-input"
            placeholder="Enter reminder type"
          />
        </div>

        <div>
          <label className="update-reminder-label">Description:</label>
          <input
            type="text"
            name="description"
            value={reminder.description}
            onChange={handleChange}
            required
            className="update-reminder-input"
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="update-reminder-label">Date:</label>
          <input
            type="date"
            name="date"
            value={reminder.date} // Ensure your reminder object has a 'date' property
            onChange={handleChange}
            required
            className="update-reminder-input"
          />
        </div>

        <div>
          <label className="update-reminder-label">Time:</label>
          <input
            type="time"
            name="time"
            value={reminder.time}
            onChange={handleChange}
            required
            className="update-reminder-input"
          />
        </div>

        <button type="submit" className="update-reminder-button">
          Update Reminder
        </button>
      </form>
    </div>
    <Footer/>
    </div>
  );
}

export default UpdateReminder;
