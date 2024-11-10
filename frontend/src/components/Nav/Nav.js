import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';
import { FaUserCircle } from 'react-icons/fa'; // Importing an icon for user profile
import Logo from '../../MEETIMAGES/Household lifestyle partner-01-01.png';

function Nav() {
  return (
    <header className="navxx">
      {/* Left side with Logo and Title */}
      <div className="navxx-left">
        <img src={Logo} alt="Logo" className="navxx-logo" />
        <h2 className="navxx-title">Life Style Planner</h2>
      </div>

      {/* Right side with Navigation Links */}
      <nav className="navxx-right">
        <ul className="navxx-links">
          
          <li>
            <NavLink exact to="/" activeClassName="navxx-active">Home</NavLink>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Reminders</a>
          </li>
          <li>
            <a href="#">Payments</a>
          </li>
          <li>
            <NavLink exact to="/about" activeClassName="navxx-active">About</NavLink>
          </li>
        </ul>

        {/* User Profile Icon and Welcome Text */}
        <div className="navxx-user-info">
          <FaUserCircle className="navxx-user-icon" />
          
        </div>
      </nav>
    </header>
  );
}

export default Nav;