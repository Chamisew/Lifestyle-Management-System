import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./all.css"
import { jwtDecode } from 'jwt-decode';
import Nav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';


const ViewMemorialDay = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateReminder, setUpdateReminder] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

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
    fetchReminders(selectedDate);
  }, [selectedDate]);

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

  const fetchReminders = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const formattedDate = utcDate.toISOString().split("T")[0];
      const response = await axios.get(`http://localhost:5000/eventMind/dateMemorialDays?date=${formattedDate}`,
        {
          headers: {
              Authorization: `Bearer ${token}` // Include the token in the headers
          }
      }
      );
      setReminders(response.data);
    } catch (error) {
      setError("Failed to fetch reminders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReminders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/eventMind/reminders?event=MemorialDay`
        ,
        {
          headers: {
              Authorization: `Bearer ${token}` // Include the token in the headers
          }
      }

      );
      setReminders(response.data);
    } catch (error) {
      setError("Failed to fetch all reminders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      fetchReminders(selectedDate);
    } catch (error) {
      setError("Failed to delete reminder. Please try again.");
    }
  };

  const handleUpdateReminder = (reminder) => {
    setUpdateReminder(reminder);
  };

  const handleUpdateReminderChange = (event) => {
    const { name, value } = event.target;
    setUpdateReminder({ ...updateReminder, [name]: value });
  };

  const handleUpdateReminderSubmit = async (event) => {
    event.preventDefault();
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
    } catch (error) {
      setError("Failed to update reminder. Please try again.");
    }
  };

  const handleSendWishAndGift = (reminder) => {
    navigate("/sendwishandgift", {
      state: { id: reminder._id, email: reminder.email, wish: reminder.wish },
    });
  };

  const calculateCountdown = (targetDate) => {
    const now = new Date();
    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
      return "Time's up!";
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    if (reminders.length > 0) {
      const targetDate = new Date(reminders[0].date);
      const intervalId = setInterval(() => {
        const remainingTime = calculateCountdown(targetDate);
        if (remainingTime === "Time's up!") {
          clearInterval(intervalId);
        }
        setCountdown(remainingTime);
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setCountdown(null);
    }
  }, [reminders]);

  const formatCountdown = (time) => {
    if (!time || typeof time === 'string') return { display: "" };
    return {
      display: `${time.days.toString().padStart(2, "0")} : ${time.hours.toString().padStart(2, "0")} : ${time.minutes.toString().padStart(2, "0")} : ${time.seconds.toString().padStart(2, "0")}`,
    };
  };

  const highlightDates = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    return reminders.some(reminder => reminder.date === formattedDate) ? "highlight" : null;
  };

  const countdownDisplay = formatCountdown(countdown);

  const filteredReminders = reminders.filter((reminder) =>
    reminder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = (remindersList, title) => {
    const doc = new jsPDF();
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = 20;

    doc.text(title, 10, 10);

    remindersList.forEach((reminder, index) => {
      if (yOffset >= pageHeight - 20) {
        doc.addPage();
        yOffset = 20;
      }

      doc.text(`${index + 1}. Name: ${reminder.name}`, 10, yOffset);
      yOffset += lineHeight;
      doc.text(`   Date: ${new Date(reminder.date).toLocaleDateString()}`, 10, yOffset);
      yOffset += lineHeight;
      doc.text(`   Time: ${reminder.time}`, 10, yOffset);
      yOffset += lineHeight;
      doc.text(`   Email: ${reminder.email}`, 10, yOffset);
      yOffset += lineHeight;
      doc.text(`   Wish: ${reminder.wish}`, 10, yOffset);
      yOffset += lineHeight;
      doc.text(`   Address: ${reminder.address}`, 10, yOffset);
      yOffset += lineHeight + 10; 
    });

    doc.save(`${title.toLowerCase().replace(" ", "_")}.pdf`);
  };

  return (
    <div>
      <Nav/>

    <div className="adtitle">
      <h1>Memorial Days</h1>
      <Calendar onChange={handleDateChange} value={selectedDate} tileClassName={highlightDates} />

      <div className="adsearch-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="adbutton-group-calendar">
        <button onClick={async () => {
          await fetchReminders(selectedDate);
          generatePDF(filteredReminders, `Date Related Reminders for ${selectedDate.toDateString()}`);
        }}>Date Related</button>
        <button onClick={async () => {
          await fetchAllReminders();
          if (reminders.length > 0) {
            generatePDF(reminders, "All Reminders for Memorial Days");
          } else {
            alert("No reminders found for Memorial Days.");
          }
        }}>All Reminders</button>
      </div>

      <div className="adreminder-details">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {filteredReminders.length > 0 ? (
          filteredReminders.map((reminder, index) => (
            <div key={index} className="adreminder">
              <h2>{reminder.name}'s Memorial Day</h2>
              <p>Date: {new Date(reminder.date).toLocaleDateString()}</p>
              <p>Time: {reminder.time}</p>
              <p>Email: {reminder.email}</p>
              <p>Wish: {reminder.wish}</p>
              <p>Address: {reminder.address}</p>
              {countdownDisplay.display && <div className="adcountdown"><span>{countdownDisplay.display}</span></div>}

              <div className="adbutton-group">
              <button onClick={() => handleUpdateReminder(reminder)}>Update</button>
                <button onClick={() => handleDeleteReminder(reminder._id)}>Delete</button>
                <button onClick={() => handleSendWishAndGift(reminder)}>Send Wish & Gift</button>
              </div>

              {updateReminder && updateReminder._id === reminder._id && (
                <div className="adpopup">
                  <div className="adpopup-inner">
                    <h2>Update Reminder</h2>
                    <form onSubmit={handleUpdateReminderSubmit}>
                      <input
                        type="text"
                        name="name"
                        value={updateReminder.name}
                        onChange={handleUpdateReminderChange}
                        required
                      />
                      <input
                        type="date"
                        name="date"
                        value={new Date(updateReminder.date).toISOString().split("T")[0]} // Correctly setting the date
                        onChange={handleUpdateReminderChange}
                        required
                      />
                      <input
                        type="time"
                        name="time"
                        value={updateReminder.time}
                        onChange={handleUpdateReminderChange}
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        value={updateReminder.email}
                        onChange={handleUpdateReminderChange}
                        required
                      />
                      <input
                        type="text"
                        name="wish"
                        value={updateReminder.wish}
                        onChange={handleUpdateReminderChange}
                        required
                      />
                      <input
                        type="text"
                        name="address"
                        value={updateReminder.address}
                        onChange={handleUpdateReminderChange}
                        required
                      />
                      <button type="submit">Update Reminder</button><br/>
                      <button type="button" onClick={() => setUpdateReminder(null)}>Cancel</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No reminders found for this date.</p>
        )}
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ViewMemorialDay;
