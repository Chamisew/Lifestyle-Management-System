// Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarPlus, FaCalendarAlt, FaMapMarkerAlt, FaBell } from 'react-icons/fa';
import './sidebar.css'; // Import your CSS file

function Sidebar({ isOpen, toggleSidebar }) {
    const navigate = useNavigate();

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isOpen ? 'Hide' : 'Show'} Menu
            </button>
            {isOpen && ( // Ensure content renders when isOpen is true
                <>
                    <h2>Meet Assist</h2>
                    <ul>
                        <li onClick={() => { navigate('/'); toggleSidebar(); }}>
                            <FaHome /> Home
                        </li>
                        <li onClick={() => { navigate('/add-meeting'); toggleSidebar(); }}>
                            <FaCalendarPlus /> Add Meeting
                        </li>
                        <li onClick={() => { navigate('/upcoming-meetings'); toggleSidebar(); }}>
                            <FaCalendarAlt /> Upcoming Meetings
                        </li>
                        <li onClick={() => { navigate('/get-direction'); toggleSidebar(); }}>
                            <FaMapMarkerAlt /> Location
                        </li>
                        <li onClick={() => { navigate('/meetingssmart'); toggleSidebar(); }}>
                            <FaBell />List
                        </li>
                    </ul>
                </>
            )}
        </div>
    );
}

export default Sidebar;
