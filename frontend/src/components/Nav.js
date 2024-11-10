import React from "react";
import { Link } from "react-router-dom";
import Logo from "../images/hlogo.png";
import Profile from "../images/usernew.jpg";
import './Nav.css'; // Import the CSS file

function Nav() {
  return (
    <header className="nav-container">
      <div className="nav-logo">
        <img src={Logo} alt="Logo" className="nav-logo-image"/>
        <h2 className="nav-title">Life Style Planner</h2>
      </div>
      <nav className="nav-menu">
        <ul className="nav-list">
          <li className="nav-list-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-list-item">
            <Link to="/services" className="nav-link">
              Services
            </Link>
          </li>
          <li className="nav-list-item">
            <Link to="/remainderlist" className="nav-link">
              Reminders
            </Link>
          </li>
          <li className="nav-list-item">
            <Link to="/payments" className="nav-link">
              Payments
            </Link>
          </li>
          <li className="nav-list-item">
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
        </ul>
      </nav>
      <div className="nav-profile">
        <div className="nav-welcome-message">Welcome! Abhilash</div>
        <img src={Profile} alt="Profile" className="nav-profile-image"/>
      </div>
    </header>
  );
}

export default Nav;
