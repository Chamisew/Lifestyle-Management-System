import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetNav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';
import mainImage2 from '../../../MEETIMAGES/MAIN2full.jpg';
import Sidebar from '../Sidebar/Sidebar';
import './MeetHome.css';

function MeetHome() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <div className="meeta-container">
            <MeetNav className="meeta-meet-nav" />
            <div className="meeta-main-window">
                {/* Sidebar Toggle Icon */}
                <div className="meeta-sidebar-toggle" onClick={toggleSidebar}>
                    <span className="material-icons">menu</span>
                </div>

                {/* Sidebar Component */}
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                {/* Fullscreen Main Image with Overlay */}
                <div className="meeta-main-image">
                    <img src={mainImage2} alt="Main Visual" />
                    <div className="meeta-overlay">
                        <div className="meeta-main-content">
                            <h1 className="meeta-welcome-heading">Welcome to Meet Assist</h1>
                            <p className="meeta-welcome-description">
                                Never miss a beat with your meetings again! 
                                Join us and take the stress out of managing your schedule.
                                No more pressure, no more mistakes,
                                just seamless meeting management that keeps you on track.
                                With us by your side,
                                life becomes effortlessly simple!
                            </p>
                            <button className="meeta-get-started-button" onClick={() => navigate('/add-meeting')}>
                                Add a meeting
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="meeta-card-container">
                <div className="meeta-card">
                    <div className="meeta-card-header">
                        <span className="material-icons">event</span>
                    </div>
                    <div className="meeta-card-body">
                        <span className="meeta-tag">Upcoming Meetings</span>
                        <h4>
                            Stay on top of your schedule with ease!
                        </h4>
                        <p>
                            View your upcoming meetings, make changes as needed, or even cancel them effortlessly.
                        </p>
                        <button className="meeta-get-start-button" onClick={() => navigate('/upcoming-meetings')}>Get Started</button>
                    </div>
                </div>

                <div className="meeta-card">
                    <div className="meeta-card-header">
                        <span className="material-icons">schedule</span>
                    </div>
                    <div className="meeta-card-body">
                        <span className="meeta-tag">Manage Time</span>
                        <h4>
                            Organize your meeting days with ease.
                        </h4>
                        <p>
                            Manage all your tasks effectively.
                        </p>
                        <button className="meeta-get-start-button" onClick={() => navigate('/schedule')}>Get Started</button>
                    </div>
                </div>

                <div className="meeta-card">
                    <div className="meeta-card-header">
                        <span className="material-icons">directions</span>
                    </div>
                    <div className="meeta-card-body">
                        <span className="meeta-tag">Get Direction</span>
                        <h4>
                            Get detailed directions to your meeting location effortlessly.
                        </h4>
                        <p>
                            Navigate easily to your meetings with our location features.
                        </p>
                        <button className="meeta-get-start-button" onClick={() => navigate('/get-direction')}>Get Started</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MeetHome;
