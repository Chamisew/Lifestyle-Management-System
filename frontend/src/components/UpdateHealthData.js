import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateHealthData.css'; // Import the CSS file
import Nav from './Nav';
import Footer from './Footer';
const UpdateHealthData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [type, setType] = useState('blood pressure');
  const [readings, setReadings] = useState(Array(7).fill({ day: null, value1: '', value2: '' }));

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/healthdata/view/${id}`);
        const { patientName, age, type, readings } = response.data;
        setPatientName(patientName);
        setAge(age);
        setType(type);
        setReadings(readings);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    fetchHealthData();
  }, [id]);

  const handleReadingChange = (index, field, value) => {
    const updatedReadings = [...readings];
    updatedReadings[index] = {
      ...updatedReadings[index],
      [field]: value,
    };
    setReadings(updatedReadings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedHealthData = {
      patientName,
      age,
      type,
      readings,
    };

    try {
      await axios.put(`http://localhost:5000/healthdata/update/${id}`, updatedHealthData);
      console.log('Data updated successfully');
      navigate('/viewhealthdata');
    } catch (error) {
      console.error('Error updating the data:', error);
    }
  };

  return (
    <div>
      <Nav/>
    <div className="update-health-data-container">
      <h2 className="update-health-data-header">Update Health Data</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label className="update-health-data-label">Patient Name:</label>
          <input
            className="update-health-data-input"
            type="text"
            value={patientName}
            onChange={(e) => {
              const input = e.target.value;
              const isValid = /^[A-Za-z\s'-]*$/.test(input);
              if (isValid) {
                setPatientName(input);
              } else {
                alert("Please enter a valid name. Numbers or special characters are not allowed.");
              }
            }}
            required
            placeholder="Enter patient name"
          />
        </div>

        <div>
          <label className="update-health-data-label">Age:</label>
          <input
            className="update-health-data-input"
            type="text"
            value={age}
            onChange={(e) => {
              const input = e.target.value;
              const isValid = /^[A-Za-z\s]*$/.test(input);
              if (isValid) {
                setAge(input);
              } else {
                alert("Please enter text only. Numbers or special characters are not allowed.");
              }
            }}
            required
            placeholder="Enter patient age"
          />
        </div>

        <div>
          <label className="update-health-data-label">Type:</label>
          <select
            className="update-health-data-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="blood pressure">Blood Pressure</option>
            <option value="diabetes">Diabetes</option>
          </select>
        </div>

        {readings.map((reading, index) => (
          <div key={index}>
            <h4 className="update-health-data-day-header">Day {index + 1}</h4>
            <div>
              <div>
                <label className="update-health-data-label">
                  {type === 'blood pressure' ? 'Systolic:' : 'Glucose:'}
                </label>
                <input
                  className="update-health-data-input"
                  type="number"
                  step="0.1"
                  value={reading.value1}
                  onChange={(e) => handleReadingChange(index, 'value1', e.target.value)}
                  required
                  placeholder={type === 'blood pressure' ? 'Systolic value' : 'Glucose value'}
                />
              </div>
              {type === 'blood pressure' && (
                <div>
                  <label className="update-health-data-label">Diastolic:</label>
                  <input
                    className="update-health-data-input"
                    type="number"
                    step="0.1"
                    value={reading.value2}
                    onChange={(e) => handleReadingChange(index, 'value2', e.target.value)}
                    required
                    placeholder="Diastolic value"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        <div>
          <button
            className="update-health-data-button"
            type="submit"
          >
            Update
          </button>
          <button
            className="update-health-data-button"
            type="button"
            onClick={() => navigate('/viewhealthdata')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    <Footer/>
    </div>
  );
};

export default UpdateHealthData;
