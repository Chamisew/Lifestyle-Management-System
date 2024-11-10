import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './AddSpecialDayForm.css'; // Import your CSS file for styling
import Nav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';

const AddSpecialDayForm = () => {
  const [formValues, setFormValues] = useState({
    event: '',
    date: '',
    time: '',
    name: '',
    email: '',
    address: '',
    wish: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null); // Corrected default value to null
  const [token, setToken] = useState(null);

  // Fetch user ID and token from the server
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve token from local storage
        const storedToken = localStorage.getItem('token');
        
        // Only proceed if a token exists
        if (storedToken) {
          setToken(storedToken);
          
          // Decode the token to get user information
          const decodedToken = jwtDecode(storedToken);
          console.log('Decoded Token:', decodedToken); // View token details in the console
          
          // Extract the user ID from the decoded token
          const userIdFromToken = decodedToken.id;
          setUserId(userIdFromToken);
        } else {
          console.warn('Token not found. Please log in.');
        }
      } catch (error) {
        console.warn('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const validateField = (name, value) => {
    // Validation logic remains the same
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging to ensure userId and token are available
    console.log('UserID:', userId);
    console.log('Token:', token);

    // Check for userId and token before proceeding
    if (!userId || !token) {
      console.warn('User ID or Token is missing.');
      setErrors({ form: 'User ID or Token is missing.' });
      return;
    }

    // Final validation check
    const isValid = Object.keys(formValues).every((field) => {
      validateField(field, formValues[field]);
      return !errors[field];
    });

    if (isValid) {
      try {
        const dataToSubmit = {
          ...formValues,
          userId,  // Pass the userId in the form submission
        };

        const response = await axios.post('http://localhost:5000/eventMind/reminders', dataToSubmit, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 201) {
          setSuccessMessage('You have added a reminder successfully!');
          setErrors({});
          setFormValues({
            event: '',
            date: '',
            time: '',
            name: '',
            email: '',
            address: '',
            wish: ''
          });
        } else {
          const errorData = await response.data;
          setErrors({ form: errorData.error || 'Error occurred while adding the reminder. Please try again.' });
        }
      } catch (err) {
        console.error('Error submitting form:', err.response ? err.response.data : err.message);
        setErrors({ form: err.response?.data?.error || 'There was an error submitting the form. Please try again later.' });
      }
    } else {
      setErrors({ form: 'Please fix the errors above before submitting.' });
    }
  };

  return (
    <div>
      <Nav/>
    <div className="EMform-container">
      <h2>Add New Special Day To Remind</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.form && <p className="error-message">{errors.form}</p>}
      <form className="special-day-form" onSubmit={handleSubmit}>
        <div className="vform-group">
          <label htmlFor="event">Select your Event</label>
          <select
            id="event"
            name="event"
            value={formValues.event}
            onChange={handleChange}
          >
            <option value="">Select event here</option>
            <option value="Birthdays">Birthdays</option>
            <option value="Anniversaries">Anniversaries</option>
            <option value="Memorial Dates">Memorial Dates</option>
            <option value="Other special events">Other special events</option>
          </select>
          {errors.event && <p className="error-message">{errors.event}</p>}
        </div>
        <div className="vform-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formValues.date}
            onChange={handleChange}
          />
          {errors.date && <p className="error-message">{errors.date}</p>}
        </div>
        <div className="vform-group">
          <label htmlFor="time">Reminder Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formValues.time}
            onChange={handleChange}
          />
          {errors.time && <p className="error-message">{errors.time}</p>}
        </div>
        <div className="vform-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="vform-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Enter e-mail"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="vform-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
          {errors.address && <p className="error-message">{errors.address}</p>}
        </div>
        <div className="vform-group">
          <label htmlFor="wish">Wish</label>
          <input
            type="text"
            id="wish"
            name="wish"
            value={formValues.wish}
            onChange={handleChange}
            placeholder="Type here"
          />
        </div>
        <button type="submit" className="submit-button">ADD</button>
      </form>
    </div>
    <Footer/>
    </div>
  );
};

export default AddSpecialDayForm;
