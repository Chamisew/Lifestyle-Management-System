import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import "./AddGuest.css";

// Validation functions
const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
const validatePhone = (phone) => /^\d{10}$/.test(phone); // Ensures exactly 10 digits
const validateEmail = (email) => /^[a-zA-Z0-9\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

const AddGuest = () => {
  const [name, setName] = useState('');
  const [eventId, setEventId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [invitationStatus, setInvitationStatus] = useState('pending');
  const [invitationSent, setInvitationSent] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events.');
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const nameError = validateName(name) ? '' : 'Name can only contain letters and spaces.';
    const phoneError = validatePhone(phone) ? '' : 'Phone number must be exactly 10 digits.';
    const emailError = validateEmail(email) ? '' : 'Invalid email format.';

    if (nameError || phoneError || emailError) {
      setValidationErrors({ name: nameError, phone: phoneError, email: emailError });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/guests', {
        name,
        eventId,
        phone,
        email,
        invitationStatus,
        invitationSent
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Guest added successfully!',
      });

      // Clear form fields
      setName('');
      setEventId('');
      setPhone('');
      setEmail('');
      setInvitationStatus('pending');
      setInvitationSent(false);
    } catch (err) {
      console.error('Error adding guest:', err);
      setError('Failed to add guest.');
    }
  };

  const handleMoreDetails = () => {
    try {
      navigate('/viewguest');
    } catch (err) {
      console.error('Error navigating to the page:', err);
      setError('Failed to navigate to the page.');
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
    setName(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    // Set phone only if it's exactly 10 digits
    if (value.length <= 10) { 
      setPhone(value);
    }
    
    // Validate phone length
    const phoneError = value.length === 10 ? '' : 'Phone number must be 10 digits.';
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      phone: phoneError
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9@.]/g, '');
    setEmail(filteredValue);

    // Validate email format while typing
    const emailError = validateEmail(filteredValue) ? '' : 'Invalid email format.';
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      email: emailError,
    }));
  };

  return (
    <div classname="add-guest">
      <Nav/>
        <div className="addguest-container">
          <div className="addguest-header">
            <h2 className="addguest-header-h2">Create Guest List</h2>
            <p className="addguest-header-p">Effortlessly manage and organize your event guests with our intuitive guest list feature, ensuring a smooth and memorable experience for all.</p>
            <button className="addguest-more-details" onClick={handleMoreDetails}>More Details</button>
          </div>
          {error && <p className="addguest-error">{error}</p>}
          <form className="addguest-form" onSubmit={handleSubmit}>
            <div className="addguest-form-group">
              <label htmlFor="name">Name:</label>
              <input 
                type="text" 
                id="name" 
                className="addguest-input" 
                placeholder='Enter Name'
                value={name} 
                onChange={handleNameChange} 
                required 
              />
              {validationErrors.name && <p className="addguest-error">{validationErrors.name}</p>}
            </div>
            
            <div className="addguest-form-group">
              <label htmlFor="event">Event:</label>
              <select 
                id="event" 
                className="addguest-select" 
                value={eventId} 
                onChange={(e) => setEventId(e.target.value)} 
                required
              >
                <option value="">Select an event</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>{event.name}</option>
                ))}
              </select>
            </div>
        
            <div className="addguest-form-group">
              <label htmlFor="phone">Phone:</label>
              <input 
                type="text" 
                id="phone" 
                className="addguest-input" 
                placeholder='Enter Phone'
                value={phone} 
                onChange={handlePhoneChange} 
              />
              {validationErrors.phone && <p className="addguest-error">{validationErrors.phone}</p>}
            </div>
        
            <div className="addguest-form-group">
              <label htmlFor="email">Email:</label>
              <input 
                type="email" 
                id="email" 
                className="addguest-input" 
                placeholder='Enter Email'
                value={email} 
                onChange={handleEmailChange} 
              />
              {validationErrors.email && <p className="addguest-error" style={{ color: 'red' }}>{validationErrors.email}</p>}
            </div>
        
            <div className="addguest-form-group">
              <label htmlFor="invitationStatus">Decision Status:</label>
              <select 
                id="invitationStatus" 
                className="addguest-select" 
                value={invitationStatus} 
                onChange={(e) => setInvitationStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="denied">Denied</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
        
            <div className="addguest-form-group-check">
              <label htmlFor="invitationSent">
                Invitation Sent:
                <input 
                  type="checkbox" 
                  id="invitationSent" 
                  className="addguest-checkbox" 
                  checked={invitationSent} 
                  onChange={(e) => setInvitationSent(e.target.checked)} 
                />
              </label>
            </div>
        
            <button type="submit" className="addguest-submit">Add Guest</button>
          </form>
        </div>
        <Footer/>
    </div>
  );
};

export default AddGuest;
