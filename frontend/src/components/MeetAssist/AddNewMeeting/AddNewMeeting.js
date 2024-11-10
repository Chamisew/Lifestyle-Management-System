import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MeetNav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';
import './AddNewMeeting.css';
import Sidebar from '../Sidebar/Sidebar';

const URL = 'http://localhost:5000/meet';

const AddNewMeeting = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

  const [meeting, setMeeting] = useState({
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    participants: '',
    notes: ''
  });

  const [errors, setErrors] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  const isFutureDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const isValidTimeRange = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const start = new Date();
    start.setHours(startHour, startMinute);
    
    const end = new Date();
    end.setHours(endHour, endMinute);
    
    return start < end; // Returns true if start is before end
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeeting((prevMeeting) => {
      const newMeeting = { ...prevMeeting, [name]: value };
      let newErrors = { ...errors };
  
      // Validate date
      if (name === 'date') {
        newErrors.date = isFutureDate(value) ? '' : 'Please select a future date.';
      }
  
      // Validate time range
      if (name === 'startTime' || name === 'endTime') {
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
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFutureDate(meeting.date)) {
      setErrors({ ...errors, date: 'Please select a future date.' });
      return;
    }
    if (!isValidTimeRange(meeting.startTime, meeting.endTime)) {
      setErrors({ ...errors, startTime: 'Start time must be before end time.', endTime: 'End time must be after start time.' });
      return;
    }

    const formattedDate = new Date(meeting.date).toISOString().split('T')[0];
    const formattedStartTime = `${formattedDate}T${meeting.startTime}`;
    const formattedEndTime = `${formattedDate}T${meeting.endTime}`;
    const participantsArray = meeting.participants.split(',').map(participant => participant.trim());

    const newMeeting = {
      ...meeting,
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      participants: participantsArray
    };

    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token
      if (!token) {
        console.error('No token found. User might not be logged in.');
        alert('You must be logged in to add a meeting.');
        navigate('/login'); // Redirect to login page
        return;
      }

      const response = await axios.post(URL, newMeeting, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the request headers
        }
      });

      // Reset form and error state on success
      console.log('Meeting added successfully:', response.data); // Log success response
      setMeeting({
        name: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        participants: '',
        notes: ''
      });
      setErrors({});
      navigate('/upcoming-meetings'); // Redirect to upcoming meetings page
    } catch (err) {
      console.error('Error while adding meeting:', err);
      if (err.response) {
        if (err.response.status === 401) {
          console.error('Unauthorized access - redirecting to login.');
          alert('Your session has expired. Please log in again.');
          navigate('/login'); // Redirect to login page on unauthorized access
        } else {
          alert(`Error: ${err.response.data.message || 'There was an error adding the meeting. Please try again.'}`);
        }
      } else {
        alert('Network error or server is down. Please try again later.');
      }
    }
  };
  return (
    <div className='unique-meeta'>
  <MeetNav />
  <div className="unique-main-window">
    {/* Sidebar Toggle Icon */}
    <div className="unique-sidebar-toggle" onClick={toggleSidebar}>
      <span className="material-icons">menu</span>
    </div>

    {/* Sidebar Component */}
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    <div className="unique-add-meeting-container">
      <div className="form-section unique-form-header">
        <h1 className="unique-meeting-title">Add New Meeting</h1>
      </div>
      <div className="form-section unique-form-body">
        <form onSubmit={handleSubmit} className="unique-meeting-form">
          <label className="unique-meeting-label">
            Name:
            <input type="text" name="name" value={meeting.name} onChange={handleChange} className="unique-meeting-input" />
          </label>
         
          <label className="unique-meeting-label">
            Date:
            <input type="date" name="date"  value={meeting.date} onChange={handleChange} className={`unique-meeting-input ${errors.date ? 'input-error' : ''}` } min={new Date().toISOString().split('T')[0]} />
            {errors.date && <p className="unique-meeting-error">{errors.date}</p>}
          </label>
        
          <label className="unique-meeting-label">
            Start Time:
            <input type="time" name="startTime" value={meeting.startTime} onChange={handleChange} className={`unique-meeting-input ${errors.startTime ? 'input-error' : ''}`} />
            {errors.startTime && <p className="unique-meeting-error">{errors.startTime}</p>}
          </label>
         
          <label className="unique-meeting-label">
            End Time:
            <input type="time" name="endTime" value={meeting.endTime} onChange={handleChange} className={`unique-meeting-input ${errors.endTime ? 'input-error' : ''}`} min={meeting.startTime || '00:00'} />
            {errors.endTime && <p className="unique-meeting-error">{errors.endTime}</p>}
          </label>
          
          <label className="unique-meeting-label">
            Location:
            <input type="text" name="location" value={meeting.location} onChange={handleChange} className="unique-meeting-input" />
          </label>
        
          <label className="unique-meeting-label">
            Participants (comma separated):
            <input type="text" name="participants" value={meeting.participants} onChange={handleChange} className="unique-meeting-input" />
          </label>
         
          <label className="unique-meeting-label">
            Notes:
            <textarea name="notes" value={meeting.notes} onChange={handleChange} className="unique-meeting-textarea"></textarea>
          </label>
         
          <button type="submit" className="unique-meeting-submit-button">Add Meeting</button>
        </form>
      </div>
    </div>
  </div>
  <Footer />
</div>

  );
};

export default AddNewMeeting;