import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

import Nav from '../Nav/Nav.js';
import Footer from '../Footer/Footer.js';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Nav />

      {/* Main Section */}
      <main className="main">
        {/* Fullscreen Main Image with overlay */}
        <div className="main-image-container">
          <div className="overlay">
            <div className="main-content">
              <h1 className="welcome-heading">AUTO ASSIST</h1>
              <p className="welcome-description">One place for all your vehicle reminders</p>
              <div className="button-container">
                {/* Navigate to VehicleForm */}
                <button className="main-button" onClick={() => navigate('/vehicle-form')}>
                  Your Vehicle
                </button>
                {/* Navigate to ReminderForm to view reminders */}
                <button className="main-button" onClick={() => navigate('/reminders')}>
                  View Reminder
                </button>
                {/* Navigate to ReminderForm to add a new reminder */}
                <button className="main-button" onClick={() => navigate('/reminders')}>
                  Add New Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
