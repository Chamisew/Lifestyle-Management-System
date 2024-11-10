import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MeetNav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';

const API_URL = 'http://localhost:5000/meetShedule';
const MEET_API_URL = 'http://localhost:5000/meet';

function TimeTable() {
  const { date } = useParams();
  const navigate = useNavigate(); // Hook for navigation

  const [schedule, setSchedule] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [works, setWorks] = useState([]);
  const [newWork, setNewWork] = useState({
    description: '',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [meetingNotice, setMeetingNotice] = useState('');
  const [editWork, setEditWork] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for token
    if (!token) {
      alert('You must be logged in to access this page.');
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    const fetchScheduleAndMeetings = async () => {
      try {
        // Fetch the schedule for the selected date
        const scheduleResponse = await axios.get(`${API_URL}/schedules/by-date?date=${date}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (scheduleResponse.data.length > 0) {
          setSchedule(scheduleResponse.data[0]);
          setScheduleId(scheduleResponse.data[0]._id);
          setWorks(scheduleResponse.data[0].works);
        } else {
          setSchedule(null);
          setScheduleId(null);
          setWorks([]);
        }

        // Fetch meetings for the selected date
        const meetingsResponse = await axios.get(`${MEET_API_URL}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const meetings = meetingsResponse.data;
        const meetingForDate = meetings.find(meeting => {
          const meetingDate = new Date(meeting.date).toISOString().split('T')[0];
          return meetingDate === date;
        });

        if (meetingForDate) {
          setMeetingNotice(`You have a meeting: ${meetingForDate.name} from ${new Date(meetingForDate.startTime).toLocaleTimeString()} - ${new Date(meetingForDate.endTime).toLocaleTimeString()}`);
        } else {
          setMeetingNotice('');
        }
      } catch (error) {
        console.error('Error fetching schedule or meetings:', error);
        setError('Failed to fetch schedule or meetings.');
      }
    };

    fetchScheduleAndMeetings();
  }, [date, navigate]);

  const handleAddWork = async (e) => {
    e.preventDefault();
    const { description, startTime, endTime } = newWork;
    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);
    
    if (newStartTime >= newEndTime) {
      setError('End time must be after start time.');
      return;
    }

    const overlappingWorks = works.filter((work) => {
      const workStartTime = new Date(work.startTime);
      const workEndTime = new Date(work.endTime);
      return (
        (newStartTime >= workStartTime && newStartTime < workEndTime) ||
        (newEndTime > workStartTime && newEndTime <= workEndTime)
      );
    });

    if (overlappingWorks.length > 0) {
      setError('This time range is already taken by another task.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (scheduleId) {
        const updatedWorks = [...works, newWork];
        const res = await axios.put(`${API_URL}/schedules/${scheduleId}`, {
          date,
          works: updatedWorks
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchedule(res.data);
        setWorks(res.data.works);
      } else {
        const res = await axios.post(`${API_URL}/schedules`, {
          date,
          works: [newWork]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchedule(res.data);
        setScheduleId(res.data._id);
        setWorks(res.data.works);
      }
      setNewWork({ description: '', startTime: '', endTime: '' });
      setError(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding work:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error adding work.');
      }
    }
  };

  const handleDeleteWork = async (workId) => {
    try {
      // Filter out the task to be deleted
      const updatedWorks = works.filter((work) => work.workId !== workId);
  
      const token = localStorage.getItem('token');
      
      // Check if there are no remaining tasks
      if (updatedWorks.length === 0) {
        // If no tasks are left, delete the entire schedule
        await axios.delete(`${API_URL}/schedules/${scheduleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedule(null);
        setScheduleId(null);
        setWorks([]);
        setError(null);
      } else {
        // If there are still tasks left, update the schedule with remaining tasks
        const res = await axios.put(
          `${API_URL}/schedules/${scheduleId}`,
          {
            date,
            works: updatedWorks, // Send the updated works array
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSchedule(res.data);
        setWorks(res.data.works);
        setError(null);
      }
    } catch (error) {
      console.error("Error deleting work:", error);
      setError("Error deleting work.");
    }
  };
  

  const handleEditWorkSubmit = async (e) => {
    e.preventDefault();
    const { description, startTime, endTime } = editWork;

    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);
    
    if (newStartTime >= newEndTime) {
      setError('End time must be after start time.');
      return;
    }

    const overlappingWorks = works.filter((work) => {
      if (work.workId === editWork.workId) return false;
      const workStartTime = new Date(work.startTime);
      const workEndTime = new Date(work.endTime);
      return (
        (newStartTime >= workStartTime && newStartTime < workEndTime) ||
        (newEndTime > workStartTime && newEndTime <= workEndTime)
      );
    });

    if (overlappingWorks.length > 0) {
      setError('This time range is already taken by another task.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updatedWorks = works.map((work) => {
        if (work.workId === editWork.workId) {
          return { ...work, description, startTime, endTime };
        }
        return work;
      });
      const res = await axios.put(`${API_URL}/schedules/${scheduleId}`, {
        date,
        works: updatedWorks
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedule(res.data);
      setWorks(res.data.works);
      setEditWork(null);
      setShowEditForm(false);
      setError(null);
    } catch (error) {
      console.error('Error editing work:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error editing work.');
      }
    }
  };

  const handleEditClick = (work) => {
    setEditWork(work);
    setShowEditForm(true);
    setError(null);
  };

  return (
    <div>
      <MeetNav />
      <div style={styles.container}>
        <h1 style={styles.header}>Timetable for {new Date(date).toLocaleDateString()}</h1>
        {meetingNotice && <div style={styles.meetingNotice}>{meetingNotice}</div>}

        <button
          style={styles.toggleButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '- Close Form' : '+ Add Task'}
        </button>
        {showForm && (
          <form onSubmit={handleAddWork} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Description:</label>
              <input
                type="text"
                value={newWork.description}
                onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Start Time:</label>
              <input
                type="datetime-local"
                value={newWork.startTime}
                onChange={(e) => setNewWork({ ...newWork, startTime: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>End Time:</label>
              <input
                type="datetime-local"
                value={newWork.endTime}
                onChange={(e) => setNewWork({ ...newWork, endTime: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            {error && (
              <div style={styles.error}>{error}</div>
            )}
            <button type="submit" style={styles.submitButton}>Add Task</button>
          </form>
        )}
        <ul style={styles.workList}>
          {works
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .map((work) => (
              <li key={work.workId} style={styles.workItem}>
                <span>
                  <strong>{work.description}</strong> ({new Date(work.startTime).toLocaleTimeString()} - {new Date(work.endTime).toLocaleTimeString()})
                </span>
                <div>
                  <button
                    onClick={() => handleDeleteWork(work.workId)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditClick(work)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
        </ul>

        {showEditForm && editWork && (
          <form onSubmit={handleEditWorkSubmit} style={styles.form}>
            <h3>Edit Task</h3>
            <div style={styles.formGroup}>
              <label>Description:</label>
              <input
                type="text"
                value={editWork.description}
                onChange={(e) => setEditWork({ ...editWork, description: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Start Time:</label>
              <input
                type="datetime-local"
                value={editWork.startTime}
                onChange={(e) => setEditWork({ ...editWork, startTime: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>End Time:</label>
              <input
                type="datetime-local"
                value={editWork.endTime}
                onChange={(e) => setEditWork({ ...editWork, endTime: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            {error && (
              <div style={styles.error}>{error}</div>
            )}
            <button type="submit" style={styles.submitButton}>Save Changes</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}

// Styles remain the same
const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  },
  header: {
    marginTop: 0
  },
  meetingNotice: {
    color: 'blue',
    marginBottom: '20px'
  },
  toggleButton: {
    backgroundColor: '#0d3b66',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  form: {
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  error: {
    color: 'red',
    marginBottom: '15px'
  },
  submitButton: {
    backgroundColor: '#0d3b66',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  workList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  workItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ccc'
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginRight: '10px'
  },
  editButton: {
    backgroundColor: '#2196F3',
    color: '#fff',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  }
};

export default TimeTable;
