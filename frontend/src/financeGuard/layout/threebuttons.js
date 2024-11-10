import React from 'react';
import './threebuttons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';

const ThreeButtons = () => {
  const services = [
    {
      title: 'Dashboard',
      description: 'Track and manage your monthly income to stay on top of your finances.',
      icon: 'fas fa-dollar-sign',
      link: '/allincome'
    },
    {
      title: 'Calendar',
      description: 'Organize and schedule important financial dates, such as savings, loans, and income goals.',
      icon: 'fas fa-calendar-alt',
      link: '/incomecalendar'
    },
    {
      title: 'Income vs Expenses',
      description: 'Organize and schedule important financial dates, such as bill payments and income goals.',
      icon: 'fas fa-balance-scale',
      link: '/netincome'
    },
  ];

  return (
    <section className="threebuttons-section">
      <div className="threebuttons-container">
        {services.map((service, index) => (
          <Link to={service.link} key={index} className="threebuttons-card"> {/* Use Link for navigation */}
            <div className="threebuttonsicon-container">
              <i className={service.icon}></i>
            </div>
            <h4>{service.title}</h4>
            <p>{service.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ThreeButtons;
