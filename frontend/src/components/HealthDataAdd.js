import React, { useState } from 'react';
import axios from 'axios';
import './HealthDataAdd.css'; // Make sure to import the CSS file
import Nav from './Nav';
import Footer from './Footer';
const HealthDataAdd = () => {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [type, setType] = useState('blood pressure');
  const [readings, setReadings] = useState(
    Array(7).fill({ day: null, value1: '', value2: '' })
  );

  const initializeDays = () => {
    return Array.from({ length: 7 }, (_, index) => ({
      day: index + 1,
      value1: '',
      value2: '',
    }));
  };

  useState(() => {
    setReadings(initializeDays());
  }, []);

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

    const healthData = {
      patientName,
      age,
      type,
      readings,
    };

    try {
      const response = await axios.post('http://localhost:5000/healthdata/add', healthData);
      console.log('Data added successfully:', response.data);
      setPatientName('');
      setAge('');
      setType('blood pressure');
      setReadings(initializeDays());
    } catch (error) {
      console.error('There was an error submitting the data', error);
    }
  };

  return (
    <div>
      <Nav/>
    <div className="health-data-add-container">
      <h2 className="health-data-title">Add Your Health Data</h2>
      <form onSubmit={handleSubmit} className="health-data-form space-y-6">
        {/* Patient Name */}
        <div className="input-group">
          <label className="input-label">Patient Name</label>
          <input
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
            className="input-field"
            placeholder="Enter patient name"
          />
        </div>

        {/* Age */}
        <div className="input-group">
          <label className="input-label">Age</label>
          <input
            type="text"
            value={age}
            onChange={(e) => {
              const input = e.target.value;
              const isValid = /^(?:[1-9][0-9]?|0)$/.test(input);
              if (isValid || input === "") {
                setAge(input);
              } else {
                alert("Please enter a valid age (0-99). No special characters allowed.");
              }
            }}
            required
            className="input-field"
            placeholder="Enter patient age"
          />
        </div>

        {/* Type */}
        <div className="input-group">
          <label className="input-label">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-select"
          >
            <option value="blood pressure">Blood Pressure</option>
            <option value="diabetes">Diabetes</option>
          </select>
        </div>

        {/* Readings for Days */}
        {readings.map((reading, index) => (
          <div key={index} className="reading-group">
            <h4 className="reading-title">Day {reading.day}</h4>
            <div className="reading-inputs">
              <div className="input-group">
                <label className="input-label">
                  {type === 'blood pressure' ? 'Systolic' : 'Glucose'}:
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={reading.value1}
                  onChange={(e) => handleReadingChange(index, 'value1', e.target.value)}
                  required
                  className="input-field"
                  placeholder={type === 'blood pressure' ? 'Systolic value' : 'Glucose value'}
                />
              </div>
              {type === 'blood pressure' && (
                <div className="input-group">
                  <label className="input-label">Diastolic:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={reading.value2}
                    onChange={(e) => handleReadingChange(index, 'value2', e.target.value)}
                    required
                    className="input-field"
                    placeholder="Diastolic value"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="button-group mt-6">
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button
            type="button"
            onClick={() => {
              setPatientName('');
              setAge('');
              setType('blood pressure');
              setReadings(initializeDays());
            }}
            className="cancel-button"
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

export default HealthDataAdd;
