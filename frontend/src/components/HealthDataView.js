import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './HealthDataView.css'; // Import the CSS file
import Nav from './Nav';
import Footer from './Footer';

const HealthDataView = () => {
  const [healthData, setHealthData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/healthdata/viewall');
      setHealthData(response.data);
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/healthdata/${id}`);
      fetchHealthData();
    } catch (error) {
      console.error('Error deleting health data:', error);
    }
  };

  const filteredHealthData = healthData.filter((data) => {
    const matchesSearchQuery = data.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilterType = filterType ? data.type === filterType : true;
    return matchesSearchQuery && matchesFilterType;
  });

  // Function to generate the report
  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("Health Data Report", 14, 16);

    const tableColumn = ["Patient Name", "Age", "Type", "Readings"];
    const tableRows = [];

    filteredHealthData.forEach((data) => {
      const readings = data.readings
        .map((reading, index) => `Day ${index + 1}: ${reading.value1}${data.type === 'blood pressure' ? `/${reading.value2}` : ''}`)
        .join(", ");

      const rowData = [
        data.patientName,
        data.age,
        data.type,
        readings,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("health_data_report.pdf");
  };

  return (
    <div>
      <Nav/>
    <div className="health-data-view-container">
      <h2 className="title">Health Data Records</h2>

      <div className="filter-section">
        {/* Search Bar */}
        <input
          className="search-input"
          type="text"
          placeholder="Search by patient name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter Dropdown and Add Button */}
        <div className="filter-dropdown">
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="blood pressure">Blood Pressure</option>
            <option value="diabetes">Diabetes</option>
          </select>

          {/* Add Health Data Button */}
          <button
            className="add-button"
            onClick={() => navigate('/addhealthdata')}
          >
            Add Health Data
          </button>

          {/* Generate Report Button */}
          <button
            className="report-button"
            onClick={generateReport}
          >
            Generate Report
          </button>
        </div>
      </div>

      <table className="health-data-table">
        <thead>
          <tr className="table-header">
            <th className="table-cell">Patient Name</th>
            <th className="table-cell">Age</th>
            <th className="table-cell">Type</th>
            <th className="table-cell">Readings</th>
            <th className="table-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredHealthData.map((data, index) => (
            <tr
              key={data._id}
              className={`table-row ${index % 2 === 0 ? 'even-row' : 'odd-row'} hover:bg-gray-100 transition duration-200`}
            >
              <td className="table-cell">{data.patientName}</td>
              <td className="table-cell">{data.age}</td>
              <td className="table-cell">{data.type}</td>
              <td className="table-cell">
                {data.readings.map((reading, index) => (
                  <div key={index} className="reading-text">
                    Day {index + 1}: {reading.value1} {data.type === 'blood pressure' ? `/${reading.value2}` : ''}
                  </div>
                ))}
              </td>
              <td className="table-cell actions-cell">
                <Link to={`/updatehealthdata/${data._id}`}>
                  <button className="edit-button">Edit</button>
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(data._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer/>
    </div>
  );
};

export default HealthDataView;
