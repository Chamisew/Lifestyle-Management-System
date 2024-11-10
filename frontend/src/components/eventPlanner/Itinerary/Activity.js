import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import Swal from 'sweetalert2';
import logo from "../../../MEETIMAGES/Household lifestyle partner-01-01.png";
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import './Activity.css'; 

const Activity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itineraryName, itineraryId, eventName } = location.state || {};

  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ name: '', date: '', time: '', itineraryId });
  const [editActivity, setEditActivity] = useState(null);
  
  // State to manage authentication
  const [token, setToken] = useState(localStorage.getItem('token') || null); // Get token from local storage
  const [isAuthenticated, setIsAuthenticated] = useState(!!token); // Check if authenticated

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/activities', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the header
          },
        });
        console.log('Fetched activities:', response.data); // Debug
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch activities. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    };

    if (isAuthenticated) {
      fetchActivities(); // Fetch activities only if authenticated
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, token, navigate]);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.itineraryId) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Data',
        text: 'Itinerary ID is missing.',
        confirmButtonText: 'OK'
      });
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/activities', newActivity, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the header
        },
      });
      setActivities([...activities, response.data]);
      setNewActivity({ name: '', date: '', time: '', itineraryId });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error adding activity. Please try again.',
        confirmButtonText: 'OK'
      });
      console.error('Error adding activity:', error);
    }
  };

  const handleEditActivity = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/activities/${id}`, editActivity, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the header
        },
      });
      setActivities(activities.map(activity => activity._id === id ? response.data : activity));
      setEditActivity(null);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating activity. Please try again.',
        confirmButtonText: 'OK'
      });
      console.error('Error updating activity:', error);
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the header
        },
      });
      setActivities(activities.filter(activity => activity._id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Activity deleted successfully.',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error deleting activity. Please try again.',
        confirmButtonText: 'OK'
      });
      console.error('Error deleting activity:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add logo to the PDF
    doc.addImage(logo, 'PNG', 10, 10, 20, 20); // Adjust logo dimensions and position as needed

    // Set document font size and add event and itinerary titles
    doc.setFontSize(16);
    doc.text(`Event: ${eventName || 'No Event'}`, 14, 35);
    doc.text(`Itinerary: ${itineraryName || 'No Itinerary'}`, 14, 43);

    // Add date and time generated
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();
    
    doc.setFontSize(12);
    doc.text(`Date Generated: ${formattedDate}`, 14, 51);
    doc.text(`Time Generated: ${formattedTime}`, 120, 51);

    // Define table columns and filter activities based on itinerary ID
    const columns = ['Activity Name', 'Date', 'Time'];
    const data = activities
        .filter(activity => activity.itineraryId === itineraryId)
        .map(activity => [
            activity.name,
            activity.date,
            activity.time,
        ]);

    // Create table for activities
    doc.autoTable({
        head: [columns],
        body: data,
        startY: 60,
        styles: { cellPadding: 5, fontSize: 12 },
        theme: 'grid'
    });

    // Save the PDF
    doc.save(`${eventName}_Activities_List.pdf`);
    Swal.fire('Downloaded!', 'Your PDF has been downloaded.', 'success');
};

  return (
   
    <div className="more-planning">
    <Nav/>
    <div className="more-planning-container">
      
      <div className="itinerary-details-box">
        <h1 className="more-planning-title">Plan More</h1>
        <h2 className="itinerary-info-title">Itinerary Details</h2>
        <p className="itinerary-name-info">Itinerary Name: {itineraryName}</p>
        {eventName ? (
          <p className="event-name-info">Event Name: {eventName}</p>
        ) : (
          <p className="no-event-info">No event details available.</p>
        )}

        <h3 className="add-activity-header">Add New Activity</h3>
        <form onSubmit={handleAddActivity} className="activity-form">
          <div className="form-item">
            <label className="label-text">
              Activity Name:
              <input
                type="text"
                value={newActivity.name}
                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                required
                className="input-text"
              />
            </label>
          </div>
          <div className="form-item date-time-container">
            <div className="date-input-container">
              <label className="label-text">
                Date:
                <input
                  type="date"
                  value={newActivity.date}
                  min={today}
                  onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                  required
                  className="input-date"
                />
              </label>
            </div>
            <div className="time-input-container">
              <label className="label-text">
                Time:
                <input
                  type="time"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  required
                  className="input-time"
                />
              </label>
            </div>
          </div>
          <button type="submit" className="submit-activity-button">Add Activity</button>
        </form>
      </div>
      <h3 className="activities-header">Activities</h3>
      {activities.length === 0 ? (
        <p className="no-activities-info">No activities found.</p>
      ) : (
        activities
          .filter(activity => activity.itineraryId === itineraryId)
          .map(activity => (
            <div key={activity._id} className="activity-details-container">
              {editActivity && editActivity._id === activity._id ? (
                <form onSubmit={(e) => { e.preventDefault(); handleEditActivity(activity._id); }} className="edit-activity-form">
                  <div className="form-item">
                    <label className="label-text">
                      Activity Name:
                      <input
                        type="text"
                        value={editActivity.name}
                        onChange={(e) => setEditActivity({ ...editActivity, name: e.target.value })}
                        required
                        className="input-text"
                      />
                    </label>
                  </div>
                  <div className="form-item-date-time-container">
                    <div className="date-input-container">
                      <label className="label-text">
                        Date:
                        <input
                          type="date"
                          value={editActivity.date}
                          min={today}
                          onChange={(e) => setEditActivity({ ...editActivity, date: e.target.value })}
                          required
                          className="input-date"
                        />
                      </label>
                    </div>
                    <div className="time-input-container">
                      <label className="label-text">
                        Time:
                        <input
                          type="time"
                          value={editActivity.time}
                          onChange={(e) => setEditActivity({ ...editActivity, time: e.target.value })}
                          required
                          className="input-time"
                        />
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="update-activity-button">Update</button>
                  <button type="button" onClick={() => setEditActivity(null)} className="cancel-update-button">Cancel</button>
                </form>
              ) : (
                <div className="activity-info">
                  <h4 className="activity-name-info">{activity.name}</h4>
                  <p className="activity-date-info">Date: {activity.date}</p>
                  <p className="activity-time-info">Time: {activity.time}</p>
                  <div className='activity-buttons'>
                    <FaEdit onClick={() => setEditActivity(activity)} className="edit-activity-btn" />
                    <FaTrashAlt onClick={() => handleDeleteActivity(activity._id)} className="delete-activity-btn" />
                  </div>
                </div>
              )}
            </div>
          ))
      )}

      <button onClick={downloadPDF} className="download-pdf-btn">Download</button>
      </div>
      <Footer/>
    </div>

  );
};

export default Activity;
