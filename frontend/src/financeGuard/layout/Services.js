import React from 'react';
import './Services.css';
import Report from '../components/Report/Report';
import Incomebytype from '../components/Incomebytype/Incomebytype';
import GoalProgress from '../components/GoalProgress/GoalProgress';

const Services = () => {
  const services = [
    {
      title: 'Monthly Income Report',
      description: 'the sum of all income sources for the given month.',
      component: <Report />, // Replace with Report component
    },
    {
      title: 'GOAL METER',
      description: '',
      component: <GoalProgress />, // Replace with Report component
    },
    {
      title: 'Categorizing income by sources ',
      description: 'income by each source category, making it easy for you to see which source contributes the most to your total income.',
      component: <Incomebytype />, // Replace with Report component
    },
  ];

  return (
    <section className="services-section-income">
      <h2>SUMMARY</h2>
      <h3>
      QUICK OVERVIEW OF THE<span className="highlight-income"> FINANCIAL PERFORMANCE</span>
      </h3>
      <div className="services-container-income">
        {services.map((service, index) => (
          <div className="service-card-income" key={index}>
            <div className="component-container-income">
             
              {service.component}
            </div>
            <h4>{service.title}</h4>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
