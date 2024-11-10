import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { FaSearch } from 'react-icons/fa'; 
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import "./CreatedItineraryMange.css";

const CreatedItineraryMange = () => {
  const [itineraries, setItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the JWT from local storage
        const response = await axios.get('http://localhost:5000/api/createItinerary', {
          headers: {
            Authorization: `Bearer ${token}` // Include the JWT in the request headers
          }
        });
        setItineraries(response.data);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error fetching itineraries',
          text: 'There was an error fetching your itineraries. Please try again later.',
        });
      }
    };
    fetchItineraries();
  }, []);

  const handleDelete = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the itinerary.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token'); // Retrieve the JWT for deletion
        await axios.delete(`http://localhost:5000/api/createItinerary/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Include the JWT in the request headers
          }
        });
        setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
        Swal.fire(
          'Deleted!',
          'Your itinerary has been deleted.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error!',
          'There was an error deleting the itinerary. Please try again later.',
          'error'
        );
        console.error('Error deleting itinerary:', error);
      }
    }
  };

  const handlePlanMore = (itinerary) => {
    const eventDetails = itinerary.eventId;
    navigate(`/planmore`, { 
      state: { 
        itineraryName: itinerary.name, 
        itineraryId: itinerary._id,  
        eventName: eventDetails.name,
        eventId: eventDetails._id,
      } 
    });
  };

  // Filter itineraries based on search term
  const filteredItineraries = itineraries.filter(itinerary =>
    itinerary.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="itinerary-mana">
    <Nav/>
        <div className="itinerary-management">
          
          <h1 className="itinerary-title">Your itineraries</h1>
          
          <div className="itinerary-search-container">
            <input
              type="text"
              className="itinerary-search-input"
              placeholder="Search itineraries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="itinerary-search-icon" />
          </div>
          
          {filteredItineraries.length === 0 ? (
            <p className="no-itineraries">No itineraries found.</p>
          ) : (
            filteredItineraries.map((itinerary) => (
              <div key={itinerary._id} className="itinerary-item">
                <h3 className="itinerary-name">{itinerary.name}</h3>
                <p className="itinerary-event">Event: {itinerary.eventId?.name || 'Event name not available'}</p>
                <button className="plan-more-button" onClick={() => handlePlanMore(itinerary)}>Plan More</button>
                <button className="itenarydelete-button" onClick={() => handleDelete(itinerary._id)}>Delete</button>
              </div>
            ))
          )}
          </div>
          <Footer/>
        </div>
  
  );
};

export default CreatedItineraryMange;
