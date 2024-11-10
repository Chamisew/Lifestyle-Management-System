import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MeetNav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';
import logo from '../../../MEETIMAGES/Household lifestyle partner-01-01.png';
import { jsPDF } from 'jspdf'; // Import jsPDF
import './ShowAMeet.css';
import Sidebar from '../Sidebar/Sidebar';

const URL = 'http://localhost:5000/meet';

const fetchMeetingDetails = async (id, token) => {
  return await axios.get(`${URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` } // Include token in request
  }).then((res) => res.data);
};

const deleteMeeting = async (id, token) => {
  return await axios.delete(`${URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` } // Include token in request
  }).then((res) => res.data);
};

function ShowAMeet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
      setIsSidebarOpen(prevState => !prevState);
  };




  const [meeting, setMeeting] = useState(null);

  // Countdown state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token
    if (!token) {
      alert('You must be logged in to view this meeting.');
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchMeetingDetails(id, token); // Pass token to fetch meeting details
        setMeeting(data.meeting);
        updateCountdown(data.meeting.date);
      } catch (error) {
        console.error('Error fetching meeting details:', error);
        setMeeting(null); // If there's a 404 error, ensure the meeting is set to null
      }
    };

    fetchData();

    const interval = setInterval(() => {
      if (meeting) {
        updateCountdown(meeting.date);
      }
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [id, meeting, navigate]);

  const updateCountdown = (meetingDate) => {
    const now = new Date();
    const meetingDateObject = new Date(meetingDate);

    if (isNaN(meetingDateObject.getTime())) {
      setCountdown({ days: 'Invalid', hours: 'Invalid', minutes: 'Invalid', seconds: 'Invalid' });
      return;
    }

    const difference = meetingDateObject - now;

    if (difference <= 0) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setCountdown({ days, hours, minutes, seconds });
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token'); // Retrieve token
    try {
      await deleteMeeting(id, token); // First, delete the meeting
      navigate('/upcoming-meetings'); // Then navigate to the upcoming meetings page
    } catch (error) {
      console.error('Error deleting the meeting:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-meeting/${id}`); // Redirect to the edit meeting page
  };

  // Format time for display
  const formatTime = (dateTimeString) => {
    const dateObject = new Date(dateTimeString);
    return dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., "10:30 AM"
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Add the logo to the PDF (coordinates: x = 10, y = 10)
    doc.addImage(logo, 'PNG', 10, 10, 40, 40); // Adjust the size and position (x, y, width, height)
  
    // Adjust position after adding the logo
    const startY = 60; // Set this below the logo
    
    // Table headers and styles
    const headers = ["Meeting Details", "  "];
    const data = [
      ["Meeting Name", meeting.name],
      ["Start Time", formatTime(meeting.startTime)],
      ["End Time", formatTime(meeting.endTime)],
      ["Location", meeting.location],
      ["Participants", meeting.participants.join(', ')],
      ["Notes", meeting.notes || 'No notes'],
    ];
  
    const columnWidths = [60, 130];
    let newY = startY + 10; // Start below the title
  
    // Draw the header
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255); // White text
    doc.setFillColor(0, 51, 0); // Green background
    doc.rect(10, newY, columnWidths[0], 10, 'F'); // Fill header background
    doc.rect(10 + columnWidths[0], newY, columnWidths[1], 10, 'F');
  
    headers.forEach((header, index) => {
      doc.text(header, 10 + columnWidths[0] * index + 5, newY + 7); // Add padding to the text
    });
  
    newY += 10; // Move down for the data rows
  
    // Draw each row
    data.forEach((row) => {
      // Draw background for the row
      doc.setFillColor(newY % 20 === 0 ? 240 : 255); // Alternate row colors
      doc.rect(10, newY, columnWidths[0] + columnWidths[1], 10, 'F'); // Fill row background
  
      row.forEach((cell, index) => {
        doc.setTextColor(0); // Reset text color to black
        doc.text(cell, 10 + columnWidths[0] * index + 5, newY + 7);
      });
      newY += 10; // Move down for the next row
    });
  
    // Draw a border around the table
    doc.setDrawColor(0);
    doc.rect(10, startY, columnWidths[0] + columnWidths[1], newY - startY); // Table border
  
    // Save the PDF
    doc.save(`${meeting.name}_Meeting.pdf`);
  };

  return (
    <div>
       <MeetNav className="meet-nav-ma" />
<div>
  
  {/* Sidebar Toggle Icon */}
                <div className="sidebar-tog-ma" onClick={toggleSidebar}>
                    <span className="material-icons">menu</span>
                </div>

                {/* Sidebar Component */}
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />


      <div className="meeting-container-ma">
      
         
        {meeting ? (
          <div className="meeting-details-ma">
            <h1 className="meeting-title-ma">{meeting.name}</h1>
            <div className="countdown-container-ma">
              <div className="countdown-timer-ma">
                <div className="countdown-item-ma">
                  <span className="countdown-label-ma">Days:</span>
                  <span className="countdown-value-ma">{countdown.days}</span>
                </div>
                <div className="countdown-item-ma">
                  <span className="countdown-label-ma">Hours:</span>
                  <span className="countdown-value-ma">{countdown.hours}</span>
                </div>
                <div className="countdown-item-ma">
                  <span className="countdown-label-ma">Minutes:</span>
                  <span className="countdown-value-ma">{countdown.minutes}</span>
                </div>
                <div className="countdown-item-ma">
                  <span className="countdown-label-ma">Seconds:</span>
                  <span className="countdown-value-ma">{countdown.seconds}</span>
                </div>
              </div>
            </div>
            <p className="meeting-detail-ma"><strong>Start Time:</strong> {formatTime(meeting.startTime)}</p>
            <p className="meeting-detail-ma"><strong>End Time:</strong> {formatTime(meeting.endTime)}</p>
            <p className="meeting-detail-ma"><strong>Location:</strong> {meeting.location}</p>
            <p className="meeting-detail-ma"><strong>Participants:</strong> {meeting.participants.join(', ')}</p>
            <p className="meeting-detail-ma"><strong>Notes:</strong> {meeting.notes}</p>

            <div className="meeting-buttons-ma">
              <button className="edit-button-ma" onClick={handleEdit}>Edit</button>
              <button className="delete-button-ma" onClick={handleDelete}>Delete</button>
              <button 
                onClick={handleDownloadPDF} 
                style={{
                  backgroundColor: 'lightblue',
                  border: 'solid black',
                  padding: '15px 30px', // Larger button size
                  marginTop: '10px',
                  cursor: 'pointer',
                  borderRadius: '20px', // Circular corners
                  fontSize: '16px' // Optional: Increase font size
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        ) : (
          <p className="loading-text-ma">Loading...</p>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default ShowAMeet;
