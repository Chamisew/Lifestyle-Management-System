import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ViewReminderPage.css'; // Import the CSS file
import Nav from './Nav';
import Footer from './Footer';
function ViewReminderPage() {
    const { id } = useParams();
    const [reminder, setReminder] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchReminder = async () => {
            try {
                const response = await fetch(`http://localhost:5000/health/${id}`);
                if (!response.ok) throw new Error('Failed to fetch reminder');
                const data = await response.json();
                setReminder(data);
            } catch (error) {
                setErrorMessage('Failed to fetch reminder.');
            }
        };

        fetchReminder();
    }, [id]);

    if (errorMessage) return <p className="error">{errorMessage}</p>;
    if (!reminder) return <p>Loading...</p>;

    return (
        <div>
            <Nav/>
        <div className="view-reminder-container">
            <h2 className="view-reminder-title">View Reminder</h2>
            <div className="view-reminder-details">
                <h3 className="view-reminder-type">Reminder Type: {reminder.reminderType}</h3>
                <p className="view-reminder-description">Description: {reminder.description}</p>
                <p className="view-reminder-days">Days: {reminder.days}</p>
                <p className="view-reminder-time">Time: {reminder.time}</p>
            </div>
        </div>
        <Footer/>
        </div>
    );
}

export default ViewReminderPage;
