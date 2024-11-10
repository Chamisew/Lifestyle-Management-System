import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import './PayTrackHome.css';

function PayTrackHome() {
    const navigate = useNavigate();

    return (
        
            <div className="main-window">
                {/* Fullscreen Main Image with Overlay */}
                <div className="main-image">
                    <div className="overlay">
                        <div className="main-content">
                            <h1 className="welcome-heading">Welcome to PayTrack</h1>
                            <p className="welcome-description">
                                Welcome to PayTrack, your ultimate hub for managing payments, 
                                tracking card details, and setting timely reminders. Stay on top of your finances, avoid late fees, 
                                and never miss an important payment. PayTrack keeps you effortlessly organized.
                            </p>
                            <button className="get-started-button" onClick={() => navigate('/add-payment')}>
                                Get Started with Payments
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    
    );
}

export default PayTrackHome;
