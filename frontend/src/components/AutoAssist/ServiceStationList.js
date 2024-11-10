import React from 'react';
import './vehicleList.css';
const ServiceStationList = ({ serviceStations, deleteServiceStation, setCurrentServiceStation, selectServiceStation }) => {
    return (
        <div className='vehicle-list-container1'>
            <h2 className="vehicle-list-title">Service Stations</h2>
            <ul  className="vehicle-list">
                {serviceStations.map((station) => (
                    <li className="vehicle-item" key={station._id}>
                        <span className="vehicle-details">
                        {station.name} - <a href={station.link}>{station.link}</a>
                        </span>
                        <div className="vehicle-actions">
                        <button className="edit-btn" onClick={() => setCurrentServiceStation(station)}>Edit</button>
                        <button className="delete-btn" onClick={() => deleteServiceStation(station._id)}>Delete</button>
                        <button className="edit-btn" onClick={() => selectServiceStation(station._id)}>Select</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServiceStationList;
