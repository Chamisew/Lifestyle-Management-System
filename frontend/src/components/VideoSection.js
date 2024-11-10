import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Vid from '../images/Vid.mp4'; // Import your video file
import './VideoSection.css';

const VideoSection = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className='video-container'>
            <video className='bg-video' autoPlay loop muted style={{ transform: `translateY(${scrollPosition * 0.5}px)` }}>
                <source src={Vid} type="video/mp4" />
            </video>
            <div className='videocontent'>
                <span className="vid-txt">Welcome Life Style Planner</span>
            </div>
            <div className="videobutton-container">
                <Link to="/login">
                    <button className="videologin-button">Login</button>
                </Link>
                <Link to="/register">
                    <button className="videoregister-button">Register</button>
                </Link>
            </div>
            <div className="videoorganize-text">
                <p>Organize Your Life</p>
            </div>
        </div>
    );
};

export default VideoSection;
