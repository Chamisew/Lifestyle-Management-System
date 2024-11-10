import React from "react";
import { useNavigate } from "react-router-dom";
import "./SecondPage.css";
import Image from "../../../assets/secondPage.jpeg";
import Birthday from "../../../assets/birthday.jpeg";
import Memo from "../../../assets/memo.jpeg";
import Anniversary from "../../../assets/aniversary.jpeg";
import Other from "../../../assets/other.jpeg";
import Nav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';



function SecondPage() {
  const navigate = useNavigate();

  const handleNavigateToBirthdays = () => {
    navigate("/birthday");
  };

  const handleNavigateToAnniversaries = () => {
    navigate("/anniversaries");
  };

  const handleNavigateToMemorialDates = () => {
    navigate("/mdates");
  };

  const handleNavigateToOtherSpecialDays = () => {
    navigate("/otherday");
  };
  const handleNavigateToList = () => {
    navigate("/occationsmart");
  };


  return (
    <div>
      <Nav/>


    <div className="EMmain">
      <div className="EMrow">
        <div className="col-12">
          <h1>Event Minder</h1>
        </div>
        <div className="col-12">
          <div className="row p-4">
            <div className="col-2"></div>
            <div className="col-4">
              <div className="sbutton-group">
                <button onClick={handleNavigateToBirthdays}>Birthdays</button>
                <button onClick={handleNavigateToAnniversaries}>
                  Anniversaries
                </button>
                <button onClick={handleNavigateToMemorialDates}>
                  Memorial Dates
                </button>
                <button onClick={handleNavigateToOtherSpecialDays}>
                  Other Special Days
                </button>{" "}
                 <button onClick={handleNavigateToList}>
                  Create List
                </button>{" "}
              </div>
            </div>
          
            <div className="col-2"></div>
          </div>
        </div>
      </div>

      <div className="EMevent-section">
        <div className="EMevent-card">
          <div className="row">
            <div className="col-4 p-3">
              <img src={Birthday} alt="Birthday" />
            </div>
            <div className="col-7 p-4">
              <h2>Birthdays</h2>
              <p>
                Text messages are used for personal, family, business, and
                social purposes. Government and non-government organizations in
                the 2010s started to use text messages to interact with
                citizens, as a part of e-government initiatives. In the 2010s,
                the sending of short (160 characters or fewer) text messages
                became an accepted part of many cultures, as happened earlier
                with emailing.
              </p>
              <button onClick={handleNavigateToBirthdays}>Click Here</button>
            </div>
          </div>
        </div>

        <div className="EMevent-card">
          <div className="row">
            <div className="col-4 p-3">
              <img src={Anniversary} alt="Anniversary" />
            </div>
            <div className="col-7 p-4">
              <h2>Anniversaries</h2>
              <p>
                Text messages are used for personal, family, business, and
                social purposes. Government and non-government organizations in
                the 2010s started to use text messages to interact with
                citizens, as a part of e-government initiatives. In the 2010s,
                the sending of short (160 characters or fewer) text messages
                became an accepted part of many cultures, as happened earlier
                with emailing.
              </p>
              <button onClick={handleNavigateToAnniversaries}>
                Click Here
              </button>
            </div>
          </div>
        </div>

        <div className="EMevent-card">
          <div className="row">
            <div className="col-4 p-3">
              <img src={Memo} alt="Memorial Dates" />
            </div>
            <div className="col-7 p-4">
              <h2>Memorial Dates</h2>
              <p>
                Text messages are used for personal, family, business, and
                social purposes. Government and non-government organizations in
                the 2010s started to use text messages to interact with
                citizens, as a part of e-government initiatives. In the 2010s,
                the sending of short (160 characters or fewer) text messages
                became an accepted part of many cultures, as happened earlier
                with emailing.
              </p>
              <button onClick={handleNavigateToMemorialDates}>
                Click Here
              </button>
            </div>
          </div>
        </div>

        <div className="EMevent-card">
          <div className="row">
            <div className="col-4 p-3">
              <img src={Other} alt="Other Special Days" />
            </div>
            <div className="col-7 p-4">
              <h2>Other Special Days</h2>
              <p>
                Text messages are used for personal, family, business, and
                social purposes. Government and non-government organizations in
                the 2010s started to use text messages to interact with
                citizens, as a part of e-government initiatives. In the 2010s,
                the sending of short (160 characters or fewer) text messages
                became an accepted part of many cultures, as happened earlier
                with emailing.
              </p>
              <button onClick={handleNavigateToOtherSpecialDays}>
                Click Here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default SecondPage;
