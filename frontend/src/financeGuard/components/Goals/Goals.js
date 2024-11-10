import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { iconsImgs } from "../../utils/images";
import Swal from 'sweetalert2'; // Import SweetAlert2
import "./Goals.css"; 

Modal.setAppElement('#root');

const Goals = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [goalData, setGoalData] = useState({ title: '', due_date: '', amount: '' });

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:5000/goals", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubscriptions(response.data);
    } catch (err) {
      setError("Error fetching subscriptions");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const openModal = (goal = null) => {
    setCurrentGoal(goal);
    if (goal) {
      setGoalData({
        title: goal.title,
        due_date: goal.due_date.split('T')[0],
        amount: goal.amount
      });
    } else {
      setGoalData({ title: '', due_date: '', amount: '' });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleGoalSubmit = () => {
    const token = localStorage.getItem('token');
    const request = currentGoal
      ? axios.put(`http://localhost:5000/goals/${currentGoal._id}`, goalData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      : axios.post("http://localhost:5000/goals", goalData, {
          headers: { Authorization: `Bearer ${token}` }
        });

    request
      .then(() => {
        fetchSubscriptions();
        closeModal();
        Swal.fire({
          icon: 'success',
          title: `Goal ${currentGoal ? 'Updated' : 'Added'}!`,
          showConfirmButton: true,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: `Error! There was an error ${currentGoal ? 'updating' : 'adding'} your goal.`,
          showConfirmButton: true,
        });
      });
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      const token = localStorage.getItem('token');
      axios.delete(`http://localhost:5000/goals/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          fetchSubscriptions();
          Swal.fire({
            icon: 'success',
            title: 'Deleted! Your goal has been deleted.',
            showConfirmButton: true,
          });
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error! There was an error deleting your goal.',
            showConfirmButton: true,
          });
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const today  = new Date().toISOString().split('T')[0];

  return (
    <div className="subgrid-two-item grid-common grid-c5">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Goals</h3>
        <button className="grid-c-title-icon" onClick={() => openModal()}>
          <img src={iconsImgs.plus} alt="Add" />
          
        </button>
      </div>
      <div className="grid-c5-content">
        <div className="grid-items">
          {subscriptions.map((subscription) => (
            <div className="grid-item" key={subscription._id}>
              <div className="grid-item-l">
                <div className="icon">
                  <img src={iconsImgs.alert} alt="Alert" />
                 
                </div>
                <p className="text text-silver-v1">
                  {subscription.title} <span>due {new Date(subscription.due_date).toLocaleDateString()}</span>
                </p>
              </div>
              <div className="grid-item-r">
                <span className="text-silver-v1">$ {subscription.amount}</span>
                <div className="goal-actions">
                  <button style={{ color: 'gray' }} onClick={() => openModal(subscription)}>
                    Edit
                  </button>
                  <button style={{ color: 'gray' }} onClick={() => handleDeleteGoal(subscription._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for adding/editing goals */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>{currentGoal ? 'Edit Goal' : 'Add New Goal'}</h2>
        <input 
          type="text" 
          placeholder="Goal Title" 
          value={goalData.title}
          onChange={(e) => setGoalData({ ...goalData, title: e.target.value })} 
        />
        <input 
          type="date" 
          placeholder="Due Date" 
          value={goalData.due_date}
          min={today}
          onChange={(e) => setGoalData({ ...goalData, due_date: e.target.value })} 
        />
        <input 
          type="number" 
          placeholder="Amount" 
          value={goalData.amount}
          onChange={(e) => setGoalData({ ...goalData, amount: e.target.value })} 
        />
        <button onClick={handleGoalSubmit}>{currentGoal ? 'Update Goal' : 'Add Goal'}</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default Goals;
