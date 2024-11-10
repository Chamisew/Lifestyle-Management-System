import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import './UpdateGuest.css';

// Validation functions
const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validateEmail = (email) => /^[a-zA-Z0-9\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

const UpdateGuest = () => {
  const { id } = useParams(); // Extract 'id' from the URL
  const [name, setName] = useState('');
  const [eventId, setEventId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [invitationStatus, setInvitationStatus] = useState('pending');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    // Check if the user is authenticated
    if (!token) {
      Swal.fire({
        title: 'Unauthorized',
        text: 'You need to log in to access this page.',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/login'); // Redirect to the login page
      });
    } else {
      fetchGuestDetails();
      fetchEvents();
    }
  }, [id, navigate]);

  const fetchGuestDetails = async () => {
    const token = localStorage.getItem('token'); // Get the token
    try {
      const response = await axios.get(`http://localhost:5000/api/guests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request headers
        },
      });
      const guest = response.data;
      setName(guest.name);
      setEventId(guest.eventId);
      setPhone(guest.phone);
      setEmail(guest.email);
      setInvitationStatus(guest.invitationStatus);
    } catch (err) {
      console.error('Error fetching guest details:', err.response ? err.response.data : err.message);
      setError('Failed to fetch guest details.');
    }
  };

  const fetchEvents = async () => {
    const token = localStorage.getItem('token'); // Get the token
    try {
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request headers
        },
      });
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err.response ? err.response.data : err.message);
      setError('Failed to fetch events.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const nameError = validateName(name) ? '' : 'Name can only contain letters and spaces.';
    const phoneError = validatePhone(phone) ? '' : 'Phone number must be 10 digits.';
    const emailError = validateEmail(email) ? '' : 'Invalid email format.';

    if (nameError || phoneError || emailError) {
      setValidationErrors({ name: nameError, phone: phoneError, email: emailError });
      return;
    }

    const token = localStorage.getItem('token'); // Get the token
    try {
      await axios.put(`http://localhost:5000/api/guests/${id}`, {
        name,
        eventId,
        phone,
        email,
        invitationStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request headers
        },
      });

      Swal.fire({
        title: 'Success!',
        text: 'Guest details updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate(`/editguest/${id}`);
      });
      
    } catch (err) {
      console.error('Error updating guest:', err.response ? err.response.data : err.message);
      setError('Failed to update guest. Please try again.');
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update guest details.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleNavigateToSendInvitation = () => {
    navigate(`/sendinvitation/${id}`);
  };

  // Ensure only valid characters are allowed
  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
    setName(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length <= 10) {
      setPhone(value);
    }

    const phoneError = value.length === 10 ? '' : 'Phone number must be 10 digits.';
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      phone: phoneError,
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9@.]/g, '');
    setEmail(filteredValue);

    const emailError = validateEmail(filteredValue) ? '' : 'Invalid email format.';
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      email: emailError,
    }));
  };

  return (
    <div className='update-g'>
    <Nav/>
    <div className="update-guest-form-wrapper">
    
      <div className="update-guest-form-container">
        <div className="update-guest-form-header">
          <h2>Update Guest</h2>
          {error && <p className="update-guest-form-error">{error}</p>}
        </div>
        <form className="update-guest-form" onSubmit={handleSubmit}>
          <div className="update-guest-form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              className="update-guest-form-input"
              value={name}
              onChange={handleNameChange}
              required
            />
            {validationErrors.name && <p className="update-guest-form-error">{validationErrors.name}</p>}
          </div>

          <div className="update-guest-form-group">
            <label htmlFor="event">Event:</label>
            <select
              id="event"
              className="update-guest-form-select"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              required
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div className="update-guest-form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              className="update-guest-form-input"
              value={phone}
              onChange={handlePhoneChange}
            />
            {validationErrors.phone && <p className="update-guest-form-error">{validationErrors.phone}</p>}
          </div>

          <div className="update-guest-form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="update-guest-form-input"
              value={email}
              onChange={handleEmailChange}
            />
            {validationErrors.email && <p className="update-guest-form-error">{validationErrors.email}</p>}
          </div>

          <div className="update-guest-form-group">
            <label htmlFor="invitationStatus">Decision Status:</label>
            <select
              id="invitationStatus"
              className="update-guest-form-select"
              value={invitationStatus}
              onChange={(e) => setInvitationStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="denied">Denied</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          
            <button type="submit" className="update-guest-form-submit">
              Update Guest
            </button><br></br>
            <p className='update-guest-para'>Easily invite guests to your event or activity and keep them informed with all the essential details</p>
            <button type="button" className="update-guest-form-invite" onClick={handleNavigateToSendInvitation}>
              Send Invitation
            </button>
         
        </form>
      </div>
      </div>
      <Footer/>
    </div>
  
  );
};

export default UpdateGuest;
