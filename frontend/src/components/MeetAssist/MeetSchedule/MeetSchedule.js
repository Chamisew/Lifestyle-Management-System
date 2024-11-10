import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetNav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const fetchMeetingsHandler = async () => {
  const token = localStorage.getItem('token'); // Get token from localStorage

  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch('http://localhost:5000/meet', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include token in Authorization header
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch meetings');
  }

  const data = await response.json();
  return data;
};

const fetchTimetablesHandler = async () => {
  const token = localStorage.getItem('token'); // Get token

  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch('http://localhost:5000/meetShedule/schedules', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include token in Authorization header
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch timetables');
  }

  const data = await response.json();
  return data;
};

function MeetSchedule() {
  const [meetings, setMeetings] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meetingsData = await fetchMeetingsHandler();
        setMeetings(meetingsData.meetings || []);

        const timetablesData = await fetchTimetablesHandler();
        setTimetables(timetablesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return ''; // Only apply to month view
  
    // Normalize date to UTC before formatting it as YYYY-MM-DD
    const formattedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
  
    const meetingDates = new Set(meetings.map(meeting => {
      // Convert meeting date to UTC before comparing
      const meetingDate = new Date(meeting.date);
      return new Date(Date.UTC(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate())).toISOString().split('T')[0];
    }));
  
    const timetableDates = new Set(timetables.map(timetable => {
      // Convert timetable date to UTC before comparing
      const timetableDate = new Date(timetable.date);
      return new Date(Date.UTC(timetableDate.getFullYear(), timetableDate.getMonth(), timetableDate.getDate())).toISOString().split('T')[0];
    }));
  
    const isMeetingDay = meetingDates.has(formattedDate);
    const isTimetableDay = timetableDates.has(formattedDate);
  
    if (isMeetingDay && isTimetableDay) {
      return 'highlight-pink'; // Both meeting and timetable
    } else if (isMeetingDay) {
      return 'highlight-red'; // Only meeting
    } else if (isTimetableDay) {
      return 'highlight-green'; // Only timetable
    }
  
    return ''; // No highlight
  };
  
  const onDayClick = (value) => {
    const selectedDate = value.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD using local time
    navigate(`/timetable/${selectedDate}`);
  };
  
  return (
    <div>
      <MeetNav />
      <div className="calendar-container-ma">
        <h1>Make Schedule</h1>
        <Calendar
          tileClassName={tileClassName}
          onClickDay={onDayClick}
        />
        <div className="legend-bar-ma">
          <div className="legend-item-ma">
            <span className="legend-color-ma red"></span> Red: Future Meetings
          </div>
          <div className="legend-item">
            <span className="legend-color-ma green"></span> Green: Timetable Exists
          </div>
          <div className="legend-item">
            <span className="legend-color-ma pink"></span> Pink: Both Meeting and Timetable
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        .calendar-container-ma {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

        .react-calendar {
          width: 50%;
          max-width: 500px;
        }

        .highlight-red {
          background-color: red !important;
          color: white;
        }

        .highlight-green {
          background-color: green !important;
          color: white;
        }

        .highlight-pink {
          background-color: pink !important;
          color: black;
        }

        .legend-bar-ma {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .legend-item-ma {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .legend-color-ma {
          width: 20px;
          height: 20px;
          display: inline-block;
        }

        .legend-color-ma.red {
          background-color: red;
        }

        .legend-color-ma.green {
          background-color: green;
        }

        .legend-color-ma.pink {
          background-color: pink;
        }
      `}</style>
    </div>
  );
}

export default MeetSchedule;
