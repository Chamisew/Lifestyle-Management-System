import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import { jwtDecode } from 'jwt-decode';
import Nav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';


import "./all.css";

const ViewAnniversaries = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updateReminder, setUpdateReminder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [countdowns, setCountdowns] = useState({});
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRemindersByName = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:5000/eventMind/getreminders?event=Birthdays&name=${searchTerm}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the headers
                    },
                });
                setReminders(response.data);
            } catch (error) {
                setError("Failed to fetch reminders. Please try again.");
            } finally {
                setLoading(false);
            }
        };
    
        const fetchRemindersByDate = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:5000/api/getreminders?date=${selectedDate}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setReminders(response.data);
            } catch (error) {
                setError("Failed to fetch reminders. Please try again.");
            } finally {
                setLoading(false);
            }
        };
    
        if (searchTerm.trim() !== "") {
            fetchRemindersByName(); // Fetch reminders by name when search term is not empty
        } else {
            fetchRemindersByDate(); // Fetch reminders by selected date when search term is empty
        }
    }, [searchTerm, selectedDate]); // Fetch when searchTerm or selectedDate changes
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Retrieve token from local storage
                const storedToken = localStorage.getItem('token');

                // Only proceed if a token exists
                if (storedToken) {
                    setToken(storedToken);

                    // Decode the token to get user information
                    const decodedToken = jwtDecode(storedToken);
                    console.log('Decoded Token:', decodedToken); // View token details in the console

                    // Extract the user ID from the decoded token
                    const userIdFromToken = decodedToken.id;
                    setUserId(userIdFromToken);
                } else {
                    console.warn('Token not found. Please log in.');
                }
            } catch (error) {
                console.warn('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);


    useEffect(() => {
        fetchReminders(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        if (searchTerm) {
            fetchFilteredReminders(searchTerm);
        } else {
            fetchReminders(selectedDate);
        }
    }, [searchTerm, selectedDate]);

    const fetchReminders = async (date) => {
        setLoading(true);
        setError(null);
        try {
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const formattedDate = utcDate.toISOString().split("T")[0];
            const response = await axios.get(`http://localhost:5000/eventMind/dateAnniversaries?date=${formattedDate}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the headers
                }
            });

            setReminders(response.data);
            initializeCountdowns(response.data);
        } catch (error) {
            setError("Failed to fetch reminders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredReminders = async (name) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/eventMind/searchAnniversaries?name=${name}`
                ,
        {
          headers: {
              Authorization: `Bearer ${token}` // Include the token in the headers
          }
      }

            );
            setReminders(response.data);
            initializeCountdowns(response.data);
        } catch (error) {
            setError("Failed to fetch filtered reminders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const initializeCountdowns = (reminders) => {
        const countdowns = reminders.reduce((acc, reminder) => {
            acc[reminder._id] = calculateCountdown(reminder.date, reminder.time);
            return acc;
        }, {});
        setCountdowns(countdowns);
    };

    const calculateCountdown = (reminderDate, reminderTime) => {
        const now = new Date();
        const [hours, minutes] = reminderTime.split(":").map(Number);
        const targetDateTime = new Date(reminderDate);
        targetDateTime.setHours(hours, minutes, 0);

        const difference = targetDateTime - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
            passed: false,
        };
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdowns((prevCountdowns) => {
                const updatedCountdowns = { ...prevCountdowns };
                reminders.forEach((reminder) => {
                    updatedCountdowns[reminder._id] = calculateCountdown(reminder.date, reminder.time);
                });
                return updatedCountdowns;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [reminders]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleDeleteReminder = async (reminderId) => {
        try {
            await axios.delete(`http://localhost:5000/eventMind/reminders/${reminderId}`
                ,
        {
          headers: {
              Authorization: `Bearer ${token}` // Include the token in the headers
          }
      }

            );
            setReminders((prevReminders) => prevReminders.filter(reminder => reminder._id !== reminderId));
        } catch (error) {
            setError("Failed to delete reminder. Please try again.");
        }
    };

    const handleUpdateReminder = (reminder) => {
        setUpdateReminder(reminder);
        setShowPopup(true);
    };

    const handleUpdateReminderChange = (event) => {
        const { name, value } = event.target;
        setUpdateReminder({ ...updateReminder, [name]: value });
    };

    const handleUpdateReminderSubmit = async (event) => {
        event.preventDefault();
        if (validateReminder(updateReminder)) {
            try {
                await axios.put(`http://localhost:5000/eventMind/reminders/${updateReminder._id}`, updateReminder
                    ,
        {
          headers: {
              Authorization: `Bearer ${token}` // Include the token in the headers
          }
      }

                );
                fetchReminders(selectedDate);
                setUpdateReminder(null);
                setShowPopup(false);
            } catch (error) {
                setError("Failed to update reminder. Please try again.");
            }
        }
    };

    const validateReminder = (reminder) => {
        const errors = {};
        if (!reminder.name) errors.name = "Name is required";
        if (!reminder.date) errors.date = "Date is required";
        if (!reminder.time) errors.time = "Time is required";
        if (!reminder.email) errors.email = "Email is required";
        if (!reminder.wish) errors.wish = "Wish is required";
        if (!reminder.address) errors.address = "Address is required";
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSendWishAndGift = (reminder) => {
        navigate("/sendwishandgift", {
            state: { id: reminder._id, email: reminder.email, wish: reminder.wish },
        });
    };

    const generatePDF = (remindersList, title) => {
        const doc = new jsPDF();
        let yOffset = 20;

        doc.text(title, 10, 10);

        remindersList.forEach((reminder, index) => {
            doc.text(`${index + 1}. Name: ${reminder.name}`, 10, yOffset);
            yOffset += 10;
            doc.text(`   Date: ${new Date(reminder.date).toLocaleDateString()}`, 10, yOffset);
            yOffset += 10;
            doc.text(`   Time: ${reminder.time}`, 10, yOffset);
            yOffset += 10;
            doc.text(`   Email: ${reminder.email}`, 10, yOffset);
            yOffset += 10;
            doc.text(`   Wish: ${reminder.wish}`, 10, yOffset);
            yOffset += 20;
        });

        doc.save(`${title.toLowerCase().replace(" ", "_")}.pdf`);
    };

    return (
        <div>
      <Nav/>


        <div className="adtitle">
            <h1>Anniversaries</h1>
            <Calendar onChange={handleDateChange} value={selectedDate} />

            <div className="adsearch-bar">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="adbutton-group-calendar">
                <button
                    onClick={() => {
                        fetchReminders(selectedDate).then(() => {
                            generatePDF(reminders, `Anniversary Reminders for ${selectedDate.toDateString()}`);
                        });
                    }}
                >
                    Date Related
                </button>
                <button
                    onClick={async () => {
                        await fetchFilteredReminders(searchTerm);
                        generatePDF(reminders, "All Reminders");
                    }}
                >
                    All Reminders
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <div className="adreminder-details">
                {reminders.length > 0 ? (
                    reminders.map((reminder, index) => {
                        const countdown = countdowns[reminder._id] || {}; // Set default to an empty object
                        return (
                            <div key={index} className="adreminder">
                                <h2>{reminder.name}'s Anniversary</h2>
                                <p>Date: {new Date(reminder.date).toLocaleDateString()}</p>
                                <p>Time: {reminder.time}</p>
                                <p>Email: {reminder.email}</p>
                                <p>Wish: {reminder.wish}</p>
                                <p>Address: {reminder.address}</p>
                                
                                {/* Countdown displayed here */}
                                {countdown.passed ? (
                                    <p>Countdown: Event has passed</p>
                                ) : (
                                    <p>Countdown: {countdown.days || 0}d {countdown.hours || 0}h {countdown.minutes || 0}m {countdown.seconds || 0}s</p>
                                )}

                                {/* Updated Button Placement */}
                                <div className="adbutton-group">
                                    <button onClick={() => handleUpdateReminder(reminder)}>Update</button>
                                    <button onClick={() => handleDeleteReminder(reminder._id)}>Delete</button>
                                    <button onClick={() => handleSendWishAndGift(reminder)}>Send Wish and Gift</button> 
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No reminders found for this date.</p>
                )}
            </div>

            {showPopup && (
                <div className="adpopup">
                    <h2>Update Reminder</h2>
                    <form onSubmit={handleUpdateReminderSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={updateReminder.name || ""}
                            onChange={handleUpdateReminderChange}
                        />
                        {validationErrors.name && <p className="error">{validationErrors.name}</p>}
                        <input
                            type="date"
                            name="date"
                            placeholder="Date"
                            value={updateReminder.date || ""}
                            onChange={handleUpdateReminderChange}
                        />
                        {validationErrors.date && <p className="error">{validationErrors.date}</p>}
                        <input
                            type="time"
                            name="time"
                            placeholder="Time"
                            value={updateReminder.time || ""}
                            onChange={handleUpdateReminderChange}
                        />
                        {validationErrors.time && <p className="error">{validationErrors.time}</p>}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={updateReminder.email || ""}
                            onChange={handleUpdateReminderChange}
                        />
                        {validationErrors.email && <p className="error">{validationErrors.email}</p>}
                        <textarea
                            name="wish"
                            placeholder="Wish"
                            value={updateReminder.wish || ""}
                            onChange={handleUpdateReminderChange}
                        />
                        {validationErrors.wish && <p className="error">{validationErrors.wish}</p>}
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={updateReminder.address || ""}
                            onChange={handleUpdateReminderChange}
                        />
                        {validationErrors.address && <p className="error">{validationErrors.address}</p>}
                        <button type="submit">Update</button><br/>
                        <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
        <Footer/>
    </div>
    );
};

export default ViewAnniversaries;
