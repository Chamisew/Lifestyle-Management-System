import React from 'react';
import './MainBanner.css';
import Threebuttons from './threebuttons'
const MainBanner = () => {
  return (
    <div className="banner">
      <div className="banner-text">
        <h2>GETS YOUR MONEY </h2>
        <h1>INTO SHAPE</h1>
        <div className="banner-buttons">
          <Threebuttons/>
          <button className="btn btn-primary-income">home page</button>
          <button className="btn btn-secondary-income">logout</button>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
