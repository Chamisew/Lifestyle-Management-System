import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import MeetNav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';
import axios from 'axios';
import './UpcomingMeet.css';
import Sidebar from '../Sidebar/Sidebar';
//import mainImage from '../../MEETIMAGES/MAIN1.jpg';

const URL = 'http://localhost:5000/meet';

const fetchHandler = async (token) => {
  return await axios.get(URL, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the request
    },
  }).then((res) => res.data);
};

function UpcomingMeet() {
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
      setIsSidebarOpen(prevState => !prevState);
  };


  // Get today's date without time
  const today = new Date().setHours(0, 0, 0, 0);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the token
    if (!token) {
      alert('You must be logged in to view your meetings.');
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    fetchHandler(token).then((data) => {
      const filteredMeetings = data.meetings.filter((meeting) => {
        const meetingDate = new Date(meeting.date).setHours(0, 0, 0, 0); // Set the time to 00:00:00 for comparison
        return meetingDate >= today; // Only show today's and upcoming meetings
      });
      setMeetings(filteredMeetings);
    }).catch((error) => {
      console.error('Error fetching meetings:', error);
      // Optionally, you can handle errors here (e.g., log out if the token is invalid)
    });
  }, [navigate, today]);

  // Filter meetings based on search term
  const filteredMeetings = meetings.filter(meeting =>
    meeting.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <MeetNav />
      <div className="main-window-ma">
                {/* Sidebar Toggle Icon */}
                <div className="sidebar-up-ma" onClick={toggleSidebar}>
                    <span className="material-icons">menu</span>
                </div>

                {/* Sidebar Component */}
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="upcoming-meetings-container-ma">
        <h1 className="main-heading-ma">Your Upcoming Meetings</h1>
        
        {/* Search Bar */}
        <div className="search-bar-container-ma">
          <input
            type="text"
            placeholder="Search meetings..."
            className="search-bar-ma"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon-ma" />
        </div>

        <div className="meetings-list-ma">
          {filteredMeetings.map((meeting) => (
            <div key={meeting._id} className="meeting-item-ma">
              <h2 className="meeting-name-ma">{meeting.name}</h2>
              <button className="view-details-button-ma" onClick={() => navigate(`/meeting/${meeting._id}`)}>View Details</button>
            </div>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default UpcomingMeet;
