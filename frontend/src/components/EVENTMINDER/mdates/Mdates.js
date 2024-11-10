import React from "react";
import { useNavigate } from "react-router-dom";
import "./mdates.css"; 
import Memo from "../../../assets/memo.jpeg";
import Nav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';


function Mdates() {
  const navigate = useNavigate();

  const handleAddReminder = () => {
    navigate("/addspecialday"); 
  };

  const handleViewReminder = () => {
    navigate("/mdates/reminder"); 
  };

  return (
    <div>
      <Nav/>


    <div className="mdates-page">
      <div className="header">Memorial Dates</div>
      <div className="row">
        <div className="col-6">
          <img src={Memo} alt="Memorial Date Illustration" />
        </div>
        <div className="col-6">
          <div className="mdates-options">
            <button className="reminder-button" onClick={handleAddReminder}>
              Add New Reminder
            </button>
            <button className="reminder-button" onClick={handleViewReminder}>
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

export default Mdates;
