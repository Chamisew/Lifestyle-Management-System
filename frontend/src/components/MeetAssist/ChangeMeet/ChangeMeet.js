import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MeetNav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';
import './Changes.css'; // Import the CSS file

const URL = 'http://localhost:5000/meet';

const fetchMeetingDetails = async (id, token) => {
  return await axios.get(`${URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` } // Include token in request
  }).then((res) => res.data);
};

const updateMeeting = async (id, updatedMeeting, token) => {
  return await axios.put(`${URL}/${id}`, updatedMeeting, {
    headers: { Authorization: `Bearer ${token}` } // Include token in request
  }).then((res) => res.data);
};

function ChangeMeet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState({
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    participants: [],
    notes: ''
  });

  const [errors, setErrors] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token
    if (!token) {
      alert('You must be logged in to edit this meeting.');
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    fetchMeetingDetails(id, token)
      .then((data) => {
        console.log('Fetched meeting data:', data); // Log the response
        if (data.meeting) {
          setMeeting({
            name: data.meeting.name || '',
            date: data.meeting.date || '',
            startTime: data.meeting.startTime || '',
            endTime: data.meeting.endTime || '',
            location: data.meeting.location || '',
            participants: data.meeting.participants || [],
            notes: data.meeting.notes || ''
          });
        } else {
          console.error('No meeting data found');
        }
      })
      .catch((error) => {
        console.error('Error fetching meeting details:', error);
      });
  }, [id, navigate]);

  const isFutureDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0); // Set time to midnight
    return selectedDate >= today;
  };
  
  const isValidTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return true;
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const start = new Date();
    start.setHours(startHour, startMinute);
    const end = new Date();
    end.setHours(endHour, endMinute);
    return start < end;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeeting((prevMeeting) => {
      const newMeeting = { ...prevMeeting, [name]: value };
      let newErrors = { ...errors };

      if (name === 'date') {
        if (!isFutureDate(value)) {
          newErrors.date = 'Please select a future date.';
        } else {
          newErrors.date = '';
        }
      } else if (name === 'startTime' || name === 'endTime') {
        if (newMeeting.startTime && newMeeting.endTime) {
          if (!isValidTimeRange(newMeeting.startTime, newMeeting.endTime)) {
            newErrors.startTime = 'Start time must be before end time.';
            newErrors.endTime = 'End time must be after start time.';
          } else {
            newErrors.startTime = '';
            newErrors.endTime = '';
          }
        }
      }

      setErrors(newErrors);
      return newMeeting;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve token
    if (!isFutureDate(meeting.date)) {
      setErrors({ ...errors, date: 'Please select a future date.' });
      return;
    }
    updateMeeting(id, meeting, token).then(() => {
      navigate(`/meeting/${id}`); // Redirect to the meeting details page after update
    });
  };

  return (
    <div>
      <MeetNav />
      <div className="edit-meeting-container">
        <h1 className="edit-meeting-title">Edit Meeting</h1>
        <form className="edit-meeting-form" onSubmit={handleSubmit}>
          <label className="edit-meeting-form-label">
            Name:
            <input
              className="edit-meeting-form-input"
              type="text"
              name="name"
              value={meeting.name}
              onChange={handleChange}
            />
          </label>
          <label className="edit-meeting-form-label">
            Date:
            <input
              className="edit-meeting-date-input"
              type="date"
              name="date"
              value={meeting.date}
              onChange={handleChange}
            />
            {errors.date && <p className="edit-meeting-error-message">{errors.date}</p>}
          </label>
          <label className="edit-meeting-form-label">
            Start Time:
            <input
              className="edit-meeting-time-input"
              type="time"
              name="startTime"
              value={meeting.startTime}
              onChange={handleChange}
            />
            {errors.startTime && <p className="edit-meeting-error-message">{errors.startTime}</p>}
          </label>
          <label className="edit-meeting-form-label">
            End Time:
            <input
              className="edit-meeting-time-input"
              type="time"
              name="endTime"
              value={meeting.endTime}
              onChange={handleChange}
            />
            {errors.endTime && <p className="edit-meeting-error-message">{errors.endTime}</p>}
          </label>
          <label className="edit-meeting-form-label">
            Location:
            <input
              className="edit-meeting-form-input"
              type="text"
              name="location"
              value={meeting.location}
              onChange={handleChange}
            />
          </label>
          <label className="edit-meeting-form-label">
            Participants (comma-separated):
            <input
              className="edit-meeting-form-input"
              type="text"
              name="participants"
              value={meeting.participants.join(', ')}
              onChange={(e) => setMeeting((prevMeeting) => ({
                ...prevMeeting,
                participants: e.target.value.split(',').map(participant => participant.trim())
              }))}
            />
          </label>
          <label className="edit-meeting-form-label">
            Notes:
            <textarea
              className="edit-meeting-form-textarea"
              name="notes"
              value={meeting.notes}
              onChange={handleChange}
            ></textarea>
          </label>
          <button className="edit-meeting-submit-button" type="submit">Save</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ChangeMeet;
