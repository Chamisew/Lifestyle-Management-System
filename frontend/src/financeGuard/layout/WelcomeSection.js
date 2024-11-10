// WelcomeSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './WelcomeSection.css';
import IncomeBySource from '../components/IncomeBySource/IncomeBySource';
import Savings from '../components/Savings/Savings';

const WelcomeSection = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleExploreMore = () => {
    navigate('/incomecalendar'); // Replace with your desired route
  };

  return (
    <div className="iniwelcome-section">
      <div className="iniwelcome-content">
        <h2>Your income</h2>
        <h1>CATEGORIES & <span className="highlight">SAVINGS</span></h1>
        <p>
          Savings is key to financial security. Setting aside funds for emergencies, retirement, and long-term goals helps you prepare for the future and manage unexpected expenses easily.
        </p>
        <div className="iniwelcome-stats">
          <div className="iniwelcome-stat-item">
            <IncomeBySource />
          </div>
        </div>
        <button className="iniwelcome-explore-button" onClick={handleExploreMore}>Explore More</button> 
      </div>
      <div className="iniwelcome-images">
        <Savings />
      </div>
    </div>
  );
};

export default WelcomeSection;
