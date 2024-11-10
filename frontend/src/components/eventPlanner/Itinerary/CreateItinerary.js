import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import "./CreateItinerary.css";

const CreateItinerary = () => {
  const [itineraryData, setItineraryData] = useState({
    name: '',
    eventId: ''
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from the database
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the JWT from local storage
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: {
            Authorization: `Bearer ${token}` // Include the JWT in the request headers
          }
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch events',
          text: 'There was an error fetching the events. Please try again later.',
        });
      }
    };
    fetchEvents();
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItineraryData({
      ...itineraryData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT for creation
      const response = await axios.post('http://localhost:5000/api/createItinerary', itineraryData, {
        headers: {
          Authorization: `Bearer ${token}` // Include the JWT in the request headers
        }
      });
      Swal.fire({
        icon: 'success',
        title: 'Itinerary Created',
        text: 'Your itinerary has been created successfully!',
      }).then(() => {
        // Redirect to the itinerary management page
        navigate('/CreatedItineraryMange');
      });
      console.log('Itinerary created successfully:', response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: 'There was an error creating the itinerary. Please try again later.',
      });
      console.error('Error creating itinerary:', error);
    }
  };

  const handleVisit = () => {
    navigate('/CreatedItineraryMange');
  };

  return (
    <div className="center-evp">
       <Nav/>
        <div className="center-container-evp">
          
          <div className="itinerary-container-evp">
            <h1 className="itinerary-title-evp">Create an Itinerary</h1>
            <h3 className="itinerary-subtitle-evp">Start planning your events step by step efficiently</h3>
            <form className="itinerary-form-evp" onSubmit={handleSubmit}>
              <div className="form-group-evp">
                <label className="form-label-evp">
                  Itinerary Name:
                  <input
                    type="text"
                    name="name"
                    placeholder='Enter your itinerary name'
                    value={itineraryData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </label>
              </div>
              <div className="form-group-evp">
                <label className="form-label-evp">
                  Select Event:
                  <select
                    name="eventId"
                    value={itineraryData.eventId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select an event</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-buttons-evp">
                <button type="submit" className="submit-button-evp">Create</button>
                <button type="button" className="visit-button-evp" onClick={handleVisit}>Visit All</button>
              </div>
            </form>
          </div>
          </div>
          <Footer/>
        </div>

  );
}

export default CreateItinerary;
