import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer/Footer';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleButtonClick = (route) => {
        navigate(route);
    };

    return (
      <div>
        <Header/>
        <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            backgroundColor: '#ffffff', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
            borderRadius: '12px', 
            maxWidth: '600px', 
            margin: '40px auto',
            fontFamily: "'Roboto', sans-serif"
        }}>
            <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '600', 
                color: '#333', 
                marginBottom: '40px' 
            }}>
                Dashboard
            </h1>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '20px' 
            }}>
                <button 
                    onClick={() => handleButtonClick('/autoAssist')} 
                    style={buttonStyle}>
                    Auto Assist
                </button>
                <button 
                    onClick={() => handleButtonClick('/shopsmart')} 
                    style={buttonStyle}>
                    Shop Smart
                </button>
                <button 
                    onClick={() => handleButtonClick('/paymenthome')} 
                    style={buttonStyle}>
                    Pay Track
                </button>
                <button 
                    onClick={() => handleButtonClick('/incomemainconteiner')} 
                    style={buttonStyle}>
                    Finance Guard
                </button>
                <button 
                    onClick={() => handleButtonClick('/helthmatehome')} 
                    style={buttonStyle}>
                    Health Mate
                </button>
                <button 
                    onClick={() => handleButtonClick('/event-minder-home')} 
                    style={buttonStyle}>
                    EventnMinder
                </button>
                <button 
                    onClick={() => handleButtonClick('/meet-assist')} 
                    style={buttonStyle}>
                    Meet Assist
                </button>
                <button 
                    onClick={() => handleButtonClick('/mainhome')} 
                    style={buttonStyle}>
                    Event Planner
                </button>
            </div>
        </div>
        <Footer />
        </div>
    );
};

const buttonStyle = {
    padding: '15px 25px', 
    fontSize: '16px', 
    backgroundColor: '#007BFF', 
    color: '#ffffff', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    transition: 'background-color 0.3s ease', 
    boxShadow: '0 2px 8px rgba(0, 123, 255, 0.2)',
    fontWeight: '500',
    textTransform: 'capitalize',
    outline: 'none',
};

const buttonHoverStyle = {
    backgroundColor: '#0056b3',
};

// Adding hover effect for the buttons dynamically
const hoverEffect = (button) => {
    button.addEventListener('mouseover', () => {
        Object.assign(button.style, buttonHoverStyle);
    });

    button.addEventListener('mouseout', () => {
        Object.assign(button.style, buttonStyle);
    });
};

document.querySelectorAll('button').forEach(hoverEffect);

export default Dashboard;