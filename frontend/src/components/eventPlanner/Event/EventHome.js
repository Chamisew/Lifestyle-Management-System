import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import "./EventHome.css";

function EventHome() {
  const [countdown, setCountdown] = useState('');
  const [nearestEventName, setNearestEventName] = useState('');
  const [nearestEventDateTime, setNearestEventDateTime] = useState('');
  const [countdownDetails, setCountdownDetails] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the request headers
          }
        });
        const events = response.data;

        if (events.length > 0) {
          const now = moment();
          const eventsWithDateTime = events
            .map(event => {
              // Format the date to m/d/yyyy
              const formattedDate = moment(event.date).format('M/D/YYYY');
              return {
                ...event,
                eventDateTime: moment(`${formattedDate} ${event.time}`, 'M/D/YYYY HH:mm')
              };
            })
            .filter(event => event.eventDateTime.isAfter(now));

          // Sort events to get the nearest event
          const nearestEvent = eventsWithDateTime
            .sort((a, b) => a.eventDateTime - b.eventDateTime)[0];

          if (nearestEvent) {
            setNearestEventName(nearestEvent.name);
            setNearestEventDateTime(nearestEvent.eventDateTime.toISOString());
            startCountdown(nearestEvent.eventDateTime);
          } else {
            setCountdown('No upcoming events');
            setNearestEventName('');
            setNearestEventDateTime('');
          }
        } else {
          setCountdown('No upcoming events');
          setNearestEventName('');
          setNearestEventDateTime('');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    // Function to start the countdown timer
    const startCountdown = (eventDateTime) => {
      const updateCountdown = () => {
        const now = moment();
        const difference = moment.duration(moment(eventDateTime).diff(now));

        if (difference.asMilliseconds() <= 0) {
          setCountdown('Event started');
          setCountdownDetails({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          clearInterval(intervalId);
        } else {
          const days = difference.days();
          const hours = difference.hours();
          const minutes = difference.minutes();
          const seconds = difference.seconds();

          // Format countdown string in "Days : Hours : Minutes : Seconds" format
          setCountdown(`${days} : ${hours < 10 ? `0${hours}` : hours} : ${minutes < 10 ? `0${minutes}` : minutes} : ${seconds < 10 ? `0${seconds}` : seconds}`);
          setCountdownDetails({ days, hours, minutes, seconds });
        }
      };

      // Update countdown every second
      const intervalId = setInterval(updateCountdown, 1000);
      updateCountdown(); // Initial call
    };

    fetchEvents();
  }, [token]);

  return (
  
        <div className="eventpl-manager-wrapper">
          <Nav/>
          <div className="eventpl-manager-container">
            <div className="countdown-container-ep">
              {nearestEventName && (
                <>
                  <div className="countdown-timers-ep">
                    <div className="countdown-item-ep">
                      <span className="countdown-value-ep">{countdownDetails.days}</span>
                      <span className="countdown-label-ep">Days</span>
                    </div>
                    <div className="countdown-item-ep">
                      <span className="countdown-value-ep">{countdownDetails.hours < 10 ? `0${countdownDetails.hours}` : countdownDetails.hours}</span>
                      <span className="countdown-label-ep">Hours</span>
                    </div>
                    <div className="countdown-item-ep">
                      <span className="countdown-value-ep">{countdownDetails.minutes < 10 ? `0${countdownDetails.minutes}` : countdownDetails.minutes}</span>
                      <span className="countdown-label-ep">Minutes</span>
                    </div>
                    <div className="countdown-item-ep">
                      <span className="countdown-value-ep">{countdownDetails.seconds < 10 ? `0${countdownDetails.seconds}` : countdownDetails.seconds}</span>
                      <span className="countdown-label-ep">Seconds</span>
                    </div>
                  </div>
                  <div className="eventpl-details-container">
                    <p><strong>Event Name:</strong> {nearestEventName}</p>
                    <p><strong>Event Date & Time:</strong> {moment(nearestEventDateTime).format('MMMM D, YYYY h:mm A')}</p>
                  </div>
                </>
              )}
              {!nearestEventName && <p>{countdown}</p>}
            </div>

            <h1 className="eventpl-manager-title">Manage your event</h1>
            <p className="eventpl-manager-description">
              Take control of your event planning with our advanced Event Management page. This dedicated section of 
              your website allows you to seamlessly create, update, and manage events with precision. Set up automated reminders 
              to keep you on schedule, and track the countdown to each event for timely preparation. Designed for efficiency, 
              this page integrates all the essential tools you need to ensure your events are perfectly coordinated and executed.
            </p>
            <div className="eventpl-manager-actions">
              <Link to="/add-event">
                <button className="eventpl-manager-button">Add Event</button>
              </Link>
              <Link to="/events/:id">
                <button className="eventpl-manager-button">Your Events</button>
              </Link>
            </div>
          </div>
          <Footer/>
        </div>
  
  );
}

export default EventHome;
