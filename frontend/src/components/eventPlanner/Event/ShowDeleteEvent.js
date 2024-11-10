import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; 
import Swal from 'sweetalert2'; 
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import './ShowDeleteEvent.css'; 

function ShowDeleteEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token'); // Get JWT from local storage
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: { Authorization: `Bearer ${token}` } // Send JWT token in headers
        });
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this event?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token'); // Get JWT from local storage
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` } // Send JWT token in headers
        });
        setEvents(events.filter(event => event._id !== id));
        Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting event:', error);
        Swal.fire('Error!', 'Failed to delete event. Please try again.', 'error');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`); 
  };

  const EventsList = ({ events, handleEdit, handleDelete }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter events based on the search query, handle undefined event names safely
    const filteredEvents = events.filter(event =>
      event.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="load">Loading...</div>;

    return (
      <div className='showdeleEvet'>
    <Nav/>
    <div>
        <div className="event-list-container">
            <h1 className="list-title">Your Upcoming Events</h1>
            <div className="eventsearch-container">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="eventsearch-box"
                />
                <FaSearch className="eventsearch-icon" />
            </div>
            <ul className="event-list">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <li key={event._id} className="event-card">
                            <div className="event-info">
                                <h3 className="event-header">{event.name}</h3>
                                <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
                                <p className="event-time">Time: {event.time}</p>
                                <p className="event-location">Location: {event.location}</p>
                                <p className="event-attendees">Total Guests: {event.totalGuests}</p>
                                <p className="event-note">Note: {event.note}</p>
                                <div className="event-buttons">
                                    <button onClick={() => handleEdit(event._id)} className="event-edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(event._id)} className="event-delete-btn">Delete</button>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="no-events-message">No events found.</p>
                )}
            </ul>
        </div>
    </div>
    <Footer/>
</div>

     
  );
};

return (
  <EventsList
    events={events}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
  />
  );
}

export default ShowDeleteEvent;
