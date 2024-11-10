import React from 'react';
import './Main.css';  
import { useNavigate } from 'react-router-dom';
import landingPageImage from '../../../assets/EH1.jpg';
import Nav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';


function Main() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/secondpage');
  };

  return (
    
<div>
      <Nav/>

    <div className="main-window">
      {/* Fullscreen Main Image with Overlay */}
      <div className="main-image">
        <img src={landingPageImage} alt="Main Visual" />
        <div className="overlay">
          <div className="main-content">
            <h1 className="welcome-heading">EVENT MINDER</h1>
            <p className="welcome-description">
              Welcome to Event Minder, your go-to tool for remembering and celebrating the special moments in your life. 
              Whether it’s birthdays, anniversaries, or personal milestones, our platform ensures you never miss an important occasion. 
              Easily set reminders, schedule personalized wish messages, and receive timely notifications, all in one convenient place. 
              Plus, with features like gift shop locators and customizable notifications, celebrating your loved ones has never been easier.
            </p>
            <button className="get-started-button" onClick={handleGetStartedClick}>Get Started</button>
          </div>
        </div>
      </div>
    </div>
    
<Footer/>
    </div>
  );
}

export default Main;
