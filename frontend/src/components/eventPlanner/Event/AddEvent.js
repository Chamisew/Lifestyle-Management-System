import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import './AddEvent.css';

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    totalGuests: '',
    note: '' // Change "notes" to "note"
  });

  const [errors, setErrors] = useState({
    date: '',
    time: ''
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      Swal.fire({
        title: 'Unauthorized',
        text: 'Please log in to add events.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      setIsAuthenticated(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value
    });

    if (name === 'date' || name === 'time') {
      validateDateTime({
        ...eventData,
        [name]: value
      });
    }
  };

  const validateDateTime = (data) => {
    const { date, time } = data;
    const currentDate = new Date();
    const selectedDate = new Date(date + 'T' + time);

    let dateError = '';
    let timeError = '';

    if (date && time && selectedDate < currentDate) {
      dateError = 'The selected date and time cannot be in the past.';
      timeError = 'The selected date and time cannot be in the past.';
    }

    setErrors({
      date: dateError,
      time: timeError
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { date, time } = eventData;
    const selectedDate = new Date(date + 'T' + time);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      setErrors({
        date: 'The selected date and time cannot be in the past.',
        time: 'The selected date and time cannot be in the past.'
      });
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/api/events', eventData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Swal.fire({
        title: 'Success!',
        text: 'Event added successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      console.log('Event added successfully:', response.data);

      setEventData({
        name: '',
        date: '',
        time: '',
        location: '',
        totalGuests: '',
        note: '' // Reset the note field
      });

      setErrors({
        date: '',
        time: ''
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error adding event. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });

      console.error('Error adding event:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (!isAuthenticated) {
    return null; // or a loading spinner, or redirect to login
  }

  return (
  <div className='addingEventdiv'>
      <Nav/>
 
      <div className="add-event-wrapper">
        <div className="add-event-container">
          <div className="event-form-section">
            <h1 className="event-title">Add Your Event</h1>
            <h3 className="event-subtitle">Set up an event and start planning it efficiently</h3>
            <form className="event-form" onSubmit={handleSubmit}>
              <div className="event-form-group">
                <label className="event-form-label">
                  Event Name:
                  <input
                    className="event-input"
                    type="text"
                    name="name"
                    placeholder="Enter event name"
                    value={eventData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="event-form-group">
                <label className="event-form-label">
                  Date:
                  <input
                    className={`event-input ${errors.date ? 'input-error' : ''}`}
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    required
                    min={today}
                  />
                </label>
                {errors.date && <p className="error-message">{errors.date}</p>}
              </div>
              <div className="event-form-group">
                <label className="event-form-label">
                  Time:
                  <input
                    className={`event-input ${errors.time ? 'input-error' : ''}`}
                    type="time"
                    name="time"
                    placeholder="Enter Start Time"
                    value={eventData.time}
                    onChange={handleChange}
                    required
                  />
                </label>
                {errors.time && <p className="error-message">{errors.time}</p>}
              </div>
              <div className="event-form-group">
                <label className="event-form-label">
                  Location:
                  <input
                    className="event-input"
                    type="text"
                    name="location"
                    placeholder="Enter Location"
                    value={eventData.location}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="event-form-group">
                <label className="event-form-label">
                  Total Guests:
                  <input
                    className="event-input"
                    type="number"
                    name="totalGuests"
                    placeholder="Enter number of Guests"
                    value={eventData.totalGuests}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="event-form-group">
                <label className="event-form-label">
                  Notes:
                  <textarea
                    className="event-textarea"
                    name="note" // Change this from "notes" to "note"
                    placeholder="Note..."
                    value={eventData.note} // Change this from notes to note
                    onChange={handleChange}
                  />
                </label>
              </div>
              <button className="event-button" type="submit" disabled={errors.date || errors.time}>
                Add
              </button>
            </form>
          </div>
          <div className="event-image-section">
            <div className="event-image-overlay"></div>
          </div>
        </div>
        </div>
        <Footer/>
      </div>
  
  );
};

export default AddEvent;
