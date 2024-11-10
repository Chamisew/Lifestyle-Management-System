import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './IncomeSideMenu.css'; // Add styles for the side menu
import { FaDollarSign, FaBullseye, FaHome, FaMoneyCheckAlt, FaChartLine, FaSignOutAlt, FaBars, FaCreditCard } from 'react-icons/fa'; // Import additional icons

const IncomeSideMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication token or session
    localStorage.removeItem('token');
    // Redirect to login page or home page
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <div className={`income-side-menu ${isMenuOpen ? 'open' : 'closed'}`}>
      <div className="menu-toggle" onClick={toggleMenu}>
        <FaBars className="menu-icon" />
      </div>
      {isMenuOpen && (
        <div className="menu-content">
          <ul>
           
            <li>
              <Link to="/">
                <FaHome className="menu-icon" />
                Main Home
              </Link>
            </li>
            <li>
              <Link to="/paymenthome">
                <FaMoneyCheckAlt className="menu-icon" />
                Payment Details
              </Link>
            </li>
           
            <li>
              <Link to="/cardetails">
                <FaCreditCard className="menu-icon" />
                Card Details
              </Link>
            </li>
          </ul>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="menu-icon" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default IncomeSideMenu;
