import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Nav from './Nav';
import Footer from './Footer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import './HealthDataDashboard.css'; // Import the CSS file

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthDataDashboard = () => {
  const [healthData, setHealthData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedType, setSelectedType] = useState('blood pressure');
  const [patientName, setPatientName] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/healthdata/viewall');
        const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setHealthData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    fetchHealthData();
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedType, patientName, healthData]);

  const filterData = () => {
    let data = healthData.filter((entry) => entry.type === selectedType);
    if (patientName) {
      data = data.filter((entry) => entry.patientName.toLowerCase().includes(patientName.toLowerCase()));
    }
    setFilteredData(data);
  };

  const getChartData = () => {
    const labels = [];
    const dataPoints = [];

    filteredData.forEach((entry) => {
      entry.readings.forEach((reading, index) => {
        labels.push(`Day ${index + 1}`);
        dataPoints.push(selectedType === 'blood pressure' ? reading.value1 : reading.value1); // Adjust for diastolic if needed
      });
    });

    return {
      labels: labels,
      datasets: [
        {
          label: `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Readings`,
          data: dataPoints,
          borderColor: selectedType === 'blood pressure' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    };
  };

  const goToDetails = () => {
    navigate('/viewhealthdata'); // Navigate to the "Details" page
  };

  return (
    <div>
      <Nav/>
    <div className="health-data-dashboard">
      <h2>Health Data Dashboard</h2>
      
      <div className="filter-section">
        <div className="filter-group">
          <label>Patient Name:</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Search by patient name"
          />
        </div>
        
        <div className="filter-group">
          <label>Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="blood pressure">Blood Pressure</option>
            <option value="diabetes">Diabetes</option>
          </select>
        </div>
      </div>
      
      <div className="chart-container">
        <Line data={getChartData()} options={{ responsive: true }} />
      </div>

      <div className="text-center">
        <button onClick={goToDetails}>View Details</button>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default HealthDataDashboard;
