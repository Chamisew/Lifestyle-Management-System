import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import './Expenses.css'; 

function Expenses() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch events from the database
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the headers
          }
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch events. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    };
    fetchEvents();
  }, []);

  const handleGo = () => {
    const selectedEvent = events.find(event => event._id === selectedEventId);
    
    if (selectedEvent) {
      navigate('/gotrackexpense', {
        state: {
          eventName: selectedEvent.name,
          eventId: selectedEvent._id,
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No Event Selected',
        text: 'Please select an event before proceeding.',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleViewExpenses = () => {
    navigate('/viewexpenses'); // Allow viewing expenses without an event selection
  };

  return (
    <div className='expenses-wra'>
<Nav/>
        <div className='expenses-wrapper'>
          
          <div className="expenses-tracking-container">
            <h1 className="expenses-title">Track Your Expenses</h1>
            <p className="expensesevent-description">
              
                Stay on budget with our expense tracking feature.<br />
                Easily monitor and manage all your event-related costs,<br />
                ensuring every detail stays within your financial plan.
             
            </p>
            <form className="expenses-form">
              <div className="expenses-form-group">
                <label className="expenses-form-label">
                  Select Event:
                  <select
                    name="eventId"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    required
                    className="expenses-event-select"
                  >
                    <option value="">Select an event</option>
                    {events.map(event => (
                      <option key={event._id} value={event._id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button 
                type="button" 
                className="expenses-go-button" 
                onClick={handleGo} 
                disabled={!selectedEventId} // Disable if no event is selected
              >
                Go
              </button>
              <button 
                type="button" 
                className="expenses-view-expenses-button" 
                onClick={handleViewExpenses} 
              >
                View
              </button>
            </form>
          </div>
          </div>
          <Footer/>
        </div>
  
  );
}

export default Expenses;
