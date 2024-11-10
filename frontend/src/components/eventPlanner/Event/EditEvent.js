import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import './EditEvent.css';

function EditEvent() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    totalGuests: '',
    note: ''
  });
  const [errors, setErrors] = useState({
    date: '',
    time: ''
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get the JWT token

    // Check if the token exists
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You must be logged in to access this page.',
      }).then(() => {
        navigate('/login'); // Redirect to login if not authenticated
      });
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` } // Include the token in the request
        });
        const event = response.data;
        setEvent(event);
        setFormData({
          name: event.name,
          date: event.date.split('T')[0],
          time: event.time,
          location: event.location || '',
          totalGuests: event.totalGuests || '',
          note: event.note || ''
        });
      } catch (error) {
        console.error('Error fetching event:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch event data',
          text: 'There was an error fetching the event data. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const validateDateTime = ({ date, time }) => {
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

    return !dateError && !timeError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value
    };

    setFormData(updatedData);

    if (name === 'date' || name === 'time') {
      validateDateTime(updatedData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDateTime(formData)) return;

    try {
      const token = localStorage.getItem('token'); // Get the JWT token
      await axios.put(`http://localhost:5000/api/events/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` } // Include the token in the request
      });
      Swal.fire({
        icon: 'success',
        title: 'Event Updated',
        text: 'The event has been updated successfully.',
      }).then(() => navigate('/events/:id')); // Navigate to events list after successful update
    } catch (error) {
      console.error('Error updating event:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update event. Please try again later.',
      });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <div className='load'></div>;
  if (!event) return <div>Event not found.</div>;

  return (
 <div className='editevt0'>
    <Nav/>
      <div className="edit-event-wrapper">
      
        <div className="edit-event-container">
          <div className="edit-event-form-section">
            <h1 className="edit-event-title">Edit Event</h1>
            <form className="edit-event-form" onSubmit={handleSubmit}>
              <div className="edit-event-form-group">
                <label className="edit-event-form-label">
                  Event Name:
                  <input
                    className="edit-event-input"
                    type="text"
                    name="name"
                    placeholder="Enter event name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="edit-event-form-group">
                <label className="edit-event-form-label">
                  Date:
                  <input
                    className={`edit-event-input ${errors.date ? 'edit-input-error' : ''}`}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={today}
                  />
                </label>
                {errors.date && <p className="edit-error-message">{errors.date}</p>}
              </div>
              <div className="edit-event-form-group">
                <label className="edit-event-form-label">
                  Time:
                  <input
                    className={`edit-event-input ${errors.time ? 'edit-input-error' : ''}`}
                    type="time"
                    name="time"
                    placeholder="Enter Start Time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </label>
                {errors.time && <p className="edit-error-message">{errors.time}</p>}
              </div>
              <div className="edit-event-form-group">
                <label className="edit-event-form-label">
                  Location:
                  <input
                    className="edit-event-input"
                    type="text"
                    name="location"
                    placeholder="Enter Location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="edit-event-form-group">
                <label className="edit-event-form-label">
                  Total Guests:
                  <input
                    className="edit-event-input"
                    type="number"
                    name="totalGuests"
                    placeholder="Enter number of Guests"
                    value={formData.totalGuests}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="edit-event-form-group">
                <label className="edit-event-form-label">
                  Note:
                  <textarea
                    className="edit-event-textarea"
                    name="note"
                    placeholder="Note..."
                    value={formData.note}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <button className="edit-event-button" type="submit" disabled={errors.date || errors.time}>
                Update
              </button>
            </form>
          </div>
        </div>
       
      </div>
       <Footer/>
       </div>
  
  );
}

export default EditEvent;
