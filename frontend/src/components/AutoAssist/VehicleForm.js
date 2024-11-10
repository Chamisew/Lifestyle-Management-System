import React, { useState, useEffect } from 'react';
import './vehicleform.css';

// Array of popular vehicle brands for the dropdown
const vehicleBrands = [
    'Toyota', 'Honda', 'Ford', 'BMW', 'Audi',
    'Nissan', 'Chevrolet', 'Kia', 'Hyundai', 'Volkswagen','Suzuki'
];

const VehicleForm = ({ saveVehicle, currentVehicle }) => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [makeYear, setMakeYear] = useState('');
    const [lastServiceDate, setLastServiceDate] = useState('');
    const [licenseExpirationDate, setLicenseExpirationDate] = useState('');

    const [errors, setErrors] = useState({
        makeYear: '',
        lastServiceDate: '',
        licenseExpirationDate: '',
    });

    // Get today's date in 'YYYY-MM-DD' format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Load current vehicle data into the form if available
    useEffect(() => {
        if (currentVehicle) {
            setBrand(currentVehicle.brand);
            setModel(currentVehicle.model);
            setMakeYear(currentVehicle.makeYear);
            setLastServiceDate(new Date(currentVehicle.lastServiceDate).toISOString().split('T')[0]);
            setLicenseExpirationDate(new Date(currentVehicle.licenseExpirationDate).toISOString().split('T')[0]);
        }
    }, [currentVehicle]);

    // Validation for make year
    const validateMakeYear = (year) => {
        if (year < 1886 || year > 2024) {
            return 'Make year must be between 1886 and 2024.';
        }
        return '';
    };

    // Validation for last service date (should not be in the future)
    const validateDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for date-only comparison
        const selectedDate = new Date(date);

        if (selectedDate > today) {
            return 'Date cannot be in the future.';
        }
        return '';
    };

    // Validation for license expiration date (can be in the past)
    const validateLicenseExpirationDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for date-only comparison
        const selectedDate = new Date(date);

        if (selectedDate < today) {
            return 'License has already expired.'; // License expired if the date is in the past
        }
        return '';
    };

    // Event handler for make year input change
    const handleMakeYearChange = (e) => {
        const year = e.target.value;
        setMakeYear(year);
        setErrors((prev) => ({ ...prev, makeYear: validateMakeYear(year) }));
    };

    // Event handler for last service date input change
    const handleLastServiceDateChange = (e) => {
        const date = e.target.value;
        setLastServiceDate(date);
        setErrors((prev) => ({ ...prev, lastServiceDate: validateDate(date) }));
    };

    // Event handler for license expiration date input change
    const handleLicenseExpirationDateChange = (e) => {
        const date = e.target.value;
        setLicenseExpirationDate(date);
        setErrors((prev) => ({ ...prev, licenseExpirationDate: validateLicenseExpirationDate(date) }));
    };

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        // Allows submission even if there is an error with the license expiration date
        saveVehicle({ brand, model, makeYear, lastServiceDate, licenseExpirationDate, _id: currentVehicle?._id });
        clearForm();
    };

    // Clears the form after submission
    const clearForm = () => {
        setBrand('');
        setModel('');
        setMakeYear('');
        setLastServiceDate('');
        setLicenseExpirationDate('');
        setErrors({ makeYear: '', lastServiceDate: '', licenseExpirationDate: '' });
    };

    return (
        <div className='vehicleform'>
        <form onSubmit={handleSubmit}>
            <label>
                Vehicle Brand:
                <select value={brand} onChange={(e) => setBrand(e.target.value)} required>
                    <option value="">Select a brand</option>
                    {vehicleBrands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Model:
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
            </label>
            <label>
                Make Year:
                <input 
                    type="number" 
                    value={makeYear} 
                    onChange={handleMakeYearChange} 
                    required 
                    min="1886" 
                    max="2024" 
                />
                {errors.makeYear && <p className="error">{errors.makeYear}</p>}
            </label>
            <label>
                Last Service Date:
                <input 
                    type="date" 
                    value={lastServiceDate} 
                    onChange={handleLastServiceDateChange} 
                    required 
                    max={getTodayDate()}  // Allow only past dates up to today
                />
                {errors.lastServiceDate && <p className="error">{errors.lastServiceDate}</p>}
            </label>
            <label>
                License Expiration Date:
                <input 
                    type="date" 
                    value={licenseExpirationDate} 
                    onChange={handleLicenseExpirationDateChange} 
                    required 
                />
                {errors.licenseExpirationDate && <p className="error">{errors.licenseExpirationDate}</p>}
            </label>
            <button className="btn" type="submit">Save Vehicle</button>
        </form>
        </div>
    );
};

export default VehicleForm;
