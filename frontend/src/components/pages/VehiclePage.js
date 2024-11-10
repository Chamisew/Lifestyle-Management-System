// src/pages/VehiclePage.js
import React from 'react';

// import { useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import VehicleForm from '../AutoAssist/VehicleForm';
import VehicleList from '../AutoAssist/VehicleList';
import '../AutoAssist/Home.css'

function VehiclePage({ vehicles, saveVehicle, deleteVehicle, setCurrentVehicle, currentVehicle }) {
  // const navigate = useNavigate();
  
  return (
    <div>
      <Nav />
      <h1 className="title">Add Vehicles</h1>
      <VehicleForm saveVehicle={saveVehicle} currentVehicle={currentVehicle} />
      <VehicleList vehicles={vehicles} setCurrentVehicle={setCurrentVehicle} deleteVehicle={deleteVehicle} />
      {/* <button className="main-button" onClick={() => navigate('/reminders')}>Manage Reminders</button> */}
      <Footer />
    </div>
  );
}

export default VehiclePage;
