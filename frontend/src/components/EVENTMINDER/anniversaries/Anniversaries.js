import React from "react";
import { useNavigate } from "react-router-dom";
import "./Anniversaries.css"; 
import Anniversary from "../../../assets/aniversary.jpeg";
import Nav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';

function Anniversaries() {
  const navigate = useNavigate();

  const handleAddReminder = () => {
    navigate("/addspecialday");
  };

  const handleViewReminders = () => {
    navigate("/anniversaries/reminder");
  };

  return (
    <div>
      <Nav/>
    <div className="anniversaries-page">
      <div className="header">Anniversaries</div>
      <div className="row">
        <div className="col-6">
        <img src={Anniversary} alt="Anniversary Illustration" />
        </div>
        <div className="col-6">
          <div className="anniversaries-options">
            <button className="reminder-button" onClick={handleAddReminder}>
              Add New Reminder
            </button>
            <button className="reminder-button" onClick={handleViewReminders}>
              View Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default Anniversaries;
