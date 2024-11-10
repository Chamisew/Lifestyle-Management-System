import React, { useState, useEffect } from 'react';

const ServiceStationForm = ({ saveServiceStation, currentServiceStation }) => {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    useEffect(() => {
        if (currentServiceStation) {
            setName(currentServiceStation.name);
            setLink(currentServiceStation.link);
        }
    }, [currentServiceStation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        saveServiceStation({ name, link, _id: currentServiceStation?._id });
    };

    return (
        <div className='vehicleform'>
        <form onSubmit={handleSubmit}>
            <label>
                Service Station Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
                Accessible Link:
                <input type="text" value={link} onChange={(e) => setLink(e.target.value)} required />
            </label>
            <button type="submit">Save Service Station</button>
        </form>
        </div>
    );
};

export default ServiceStationForm;
