import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import Nav from "../../Nav/Nav";
import Footer from "../../Footer/Footer";
import "./EventPlannerHome.css";


function EventPlannerHome() {
  const navigate = useNavigate();

  const handleNavigateToEventHome = () => {
    navigate('/eventhome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToItinerary = () => {
    navigate('/createitinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToExpenses = () => {
    navigate('/expenses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToGuest = () => {
    navigate('/addguest');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-ep">
      <Nav/>
      <div className="main-window-ep">
        {/* Fullscreen Main Image with Overlay */}
        <div className="hero-section-ep">
        
          <div className="overlay-ep">
            <div className="hero-content-ep">
              <h1 className="welcome-heading-ep">Event Planner</h1>
              <p className="welcome-description-ep">
                Welcome to your Event Planner, designed for seamless and efficient event planning. 
                Effortlessly coordinate every aspect of your events with integrated features like 
                reminders, countdowns, guest lists, and expense tracking all in one place. 
                Stay organized, on schedule, and in control, ensuring your events run smoothly from start to finish.
              </p>
            </div>
          </div>
        </div>

        <div className="eventpl-navigation-container">
          <section className="eventpl-section">
            <div className="eventpl-card">
              <h2>Events</h2>
              <p>Organize your event and enjoy a countdown to the nearest one, helping you stay on track and organized.</p>
              <button className="eventpl-nav-button" onClick={handleNavigateToEventHome}>View Events</button>
            </div>
            <div className="eventpl-card">
              <h2>Plan More</h2>
              <p>Create detailed itineraries to ensure a well-organized event, keeping all activities and schedules in sync.</p>
              <button className="eventpl-nav-button" onClick={handleNavigateToItinerary}>Create Itinerary</button>
            </div>
            <div className="eventpl-card">
              <h2>Expense Tracking</h2>
              <p>Stay on top of your budget by tracking expenses efficiently, ensuring every detail is accounted for.</p>
              <button className="eventpl-nav-button" onClick={handleNavigateToExpenses}>Track Expenses</button>
            </div>
            <div className="eventpl-card">
              <h2>Manage Your Guests</h2>
              <p>Effortlessly manage your guest list and communication to ensure everyone is informed and included.</p>
              <button className="eventpl-nav-button" onClick={handleNavigateToGuest}>Manage Guests</button>
            </div>
          </section>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default EventPlannerHome;
