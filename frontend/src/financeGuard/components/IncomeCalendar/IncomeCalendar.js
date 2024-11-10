import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // For monthly view
import timeGridPlugin from '@fullcalendar/timegrid'; // For weekly view
import axios from 'axios';
import './IncomeCalendar.css';
import Incomenav from "../../layout/IncomeNav"
import Footer from '../../../components/Footer/Footer';
import Nav from '../../../components/Nav/Nav';
const IncomeCalendar = () => {
    const [userIncomes, setUserIncomes] = useState([]); // State to hold user income events
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    // Fetch user incomes and cards from the backend when the component mounts
    useEffect(() => {
        const fetchUserIncomesAndCards = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const token = localStorage.getItem('token'); // Get the JWT token from local storage

                // Fetch user incomes
                const incomeResponse = await axios.get('http://localhost:5000/budget', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the request headers
                    },
                });

                // Fetch user cards (income details)
                const cardResponse = await axios.get('http://localhost:5000/cards', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the request headers
                    },
                });

                // Format income events
                const formattedIncomeEvents = incomeResponse.data.map(income => ({
                    id: income._id,
                    title: `${income.paymentType}: ${income.amount}`,
                    start: new Date(income.date).toISOString(),
                    allDay: false,
                }));

                // Format card events
                const formattedCardEvents = cardResponse.data.map(card => ({
                    id: card._id,
                    title: `Card Income: ${card.Income}`, // Customize the title
                    start: new Date(card.incomedate).toISOString(), // Assuming incomedate contains the time
                    allDay: false,
                }));

                // Combine both events
                setUserIncomes([...formattedIncomeEvents, ...formattedCardEvents]); // Set user income events
            } catch (error) {
                setError('Error fetching user incomes or cards'); // Set error message
                console.error('Error fetching user incomes or cards:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUserIncomesAndCards(); // Call the fetch function
    }, []); // Empty dependency array to run once on component mount

    // Filter events based on the search term
    const filteredIncomes = userIncomes.filter(income =>
        income.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    if (error) {
        return <div>{error}</div>; // Show error message
    }

    return (
        <div >
        <Nav/>
       <Incomenav/>
        <div className="income-calendar-container">
            <input
                type="text"
                placeholder="Search Income..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
                className="income-search-input"
            />
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]} // Include both plugins
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek', // Only keep month and week views
                }}
                initialView="timeGridWeek" // Default to weekly view
                editable={false} // Make the calendar read-only
                events={filteredIncomes} // Use the filtered user incomes as events
            />
        </div>
        <Footer/>
        </div>
    );
};

export default IncomeCalendar;
