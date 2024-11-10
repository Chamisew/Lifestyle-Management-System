
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './vehicleList.css';
import logo from '../assests/logo.png'; // Import the logo image directly

const VehicleList = ({ vehicles, setCurrentVehicle, deleteVehicle }) => {
    const navigate = useNavigate();
    // State to store the search term
    const [searchTerm, setSearchTerm] = useState('');

    // Filtered vehicle list based on the search term
    const filteredVehicles = vehicles.filter((vehicle) => 
        (vehicle.brand ? vehicle.brand.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
        (vehicle.model ? vehicle.model.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
        (vehicle.makeYear ? vehicle.makeYear.toString() : '').includes(searchTerm) ||
        (vehicle.licenseExpirationDate ? vehicle.licenseExpirationDate : '').includes(searchTerm)
    );

    const generatePDF = () => {
        const doc = new jsPDF();

        // Add the company logo to the PDF
        doc.addImage(logo, 'PNG', 10, 10, 40, 40); // Adjust x, y, width, height as needed

        // Title and header customization
        doc.setFontSize(20);
        doc.text("Vehicle Information", 105, 40, null, null, "center"); // Shifted down to fit logo

        // Create table structure
        const tableColumn = ["S.No", "Brand", "Model", "Year", "Serviced Date", "License Expiration"];
        const tableRows = [];

        // Loop through vehicles and add them as rows
        filteredVehicles.forEach((vehicle, index) => {
            const vehicleData = [
                index + 1,
                vehicle.brand,
                vehicle.model,
                vehicle.makeYear,
                vehicle.lastServiceDate,
                vehicle.licenseExpirationDate,
            ];
            tableRows.push(vehicleData);
        });

        // Adding table to the PDF
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60, // Adjusted startY to give space for the logo and title
            theme: 'striped', // 'grid', 'striped', 'plain' themes available
            headStyles: {
                fillColor: [22, 160, 133], // Custom color for the header background
                textColor: [255, 255, 255], // White text color
                fontSize: 12,
            },
            bodyStyles: {
                textColor: [50, 50, 50], // Dark text color
                fontSize: 10,
            },
            margin: { top: 25 },
        });

        // Save the PDF
        doc.save('vehicles.pdf');
    };

    return (
        <div className="vehicle-list-container">
            <h2 className="vehicle-list-title">Your Vehicles</h2>
            
            {/* Search Input */}
            <input 
                type="text" 
                className="search-input"
                placeholder="Search vehicles..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />

            <ul className="vehicle-list">
                {filteredVehicles.map((vehicle) => (
                    <li className="vehicle-item" key={vehicle._id}>
                        <span className="vehicle-details">
                            {vehicle.brand} {vehicle.model} ({vehicle.makeYear})
                        </span>
                        <div className="vehicle-actions">
                            <button className="edit-btn" onClick={() => setCurrentVehicle(vehicle)}>Edit</button>
                            <button className="delete-btn" onClick={() => deleteVehicle(vehicle._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            <button className="generate-pdf-btn" onClick={generatePDF}>Generate PDF</button>
            <button className="generate-pdf-btn" onClick={() => navigate('/reminders')}>Manage Reminders</button>
        </div>
    );
};

export default VehicleList;
