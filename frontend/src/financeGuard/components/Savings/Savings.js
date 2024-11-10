import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { iconsImgs,  } from "../../utils/images";
import "./Savings.css";

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current index

  // Fetch savings data from the backend
  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/continue/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token from local storage
          },
        });
        setSavings(response.data); // Store the savings data in state
      } catch (error) {
        console.error("Error fetching savings:", error);
      }
    };

    fetchSavings();
  }, []);

  // Function to add a new saving
  const addSaving = async (amount, targetDate, amountLeft, description, photo) => {
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("targetDate", targetDate);
      formData.append("amountLeft", amountLeft);
      formData.append("description", description);
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await axios.post("http://localhost:5000/continue/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
        },
      });
      setSavings((prevSavings) => [...prevSavings, response.data]);
      Swal.fire("Success", "Saving added successfully!", "success");
    } catch (error) {
      console.error("Error adding saving:", error);
      Swal.fire("Error", "Failed to add saving entry.", "error");
    }
  };

  // Function to edit a saving
  const editSaving = async (id, amount, targetDate, amountLeft, description, photo) => {
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("targetDate", targetDate);
      formData.append("amountLeft", amountLeft);
      formData.append("description", description);
  
      // Only append photo if it exists (i.e., a new file is selected)
      if (photo) {
        formData.append("photo", photo);
      }
  
      const response = await axios.put(`http://localhost:5000/continue/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
        },
      });
  
      setSavings((prevSavings) =>
        prevSavings.map((saving) => (saving._id === id ? response.data : saving))
      );
      Swal.fire("Success", "Saving updated successfully!", "success");
    } catch (error) {
      console.error("Error updating saving:", error);
      Swal.fire("Error", "Failed to update saving entry.", "error");
    }
  };
  
  // Function to delete a saving
  const deleteSaving = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/continue/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
        },
      });
      setSavings((prevSavings) => prevSavings.filter((saving) => saving._id !== id));
      Swal.fire("Deleted!", "Saving entry has been deleted.", "success");

      // Adjust currentIndex if the last entry was deleted
      if (currentIndex >= savings.length - 1) {
        setCurrentIndex((prev) => Math.max(prev - 1, 0)); // Move back to the previous entry if needed
      }
    } catch (error) {
      console.error("Error deleting saving:", error);
      Swal.fire("Error", "Failed to delete saving entry.", "error");
    }
  };

  // Function to show SweetAlert for adding or editing a saving
  const showSavingDialog = (saving = {}) => {
    const isEdit = Boolean(saving._id); // Check if we're editing
    const title = isEdit ? "Edit Saving" : "Add New Saving";
  
    Swal.fire({
      title: title,
      html: `
        <input type="number" id="amount" class="swal2-input" placeholder="Amount" value="${saving.amount || ''}" required>
        <input type="date" id="targetDate" class="swal2-input"  value="${saving.targetDate ? new Date(saving.targetDate).toISOString().substring(0, 10) : ''}" required>
        <input type="number" id="amountLeft" class="swal2-input" placeholder="Amount Left" value="${saving.amountLeft || ''}" required>
        <input type="text" id="description" class="swal2-input" placeholder="Description" value="${saving.description || ''}" required>
        ${isEdit && saving.photo ? `
          <img src="http://localhost:5000${saving.photo}" alt="Current Image" style="width:100px; height:auto; margin-bottom:10px;" />
          <p>Leave the image field empty to keep the current image.</p>
        ` : ''}
        <input type="file" id="photo" class="swal2-input" accept="image/*">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const amount = document.getElementById("amount").value;
        const targetDate = document.getElementById("targetDate").value;
        const amountLeft = document.getElementById("amountLeft").value;
        const description = document.getElementById("description").value;
        const photo = document.getElementById("photo").files[0]; // Get the file from input
  
        // Validate the inputs
        if (!amount || !targetDate || !amountLeft || !description) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }
  
        return { amount, targetDate, amountLeft, description, photo };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { amount, targetDate, amountLeft, description } = result.value;
        const selectedPhoto = result.value.photo; // Photo selection handling
  
        if (isEdit) {
          // Use the existing photo if no new photo is selected
          editSaving(saving._id, amount, targetDate, amountLeft, description, selectedPhoto || saving.photo);
        } else {
          addSaving(amount, targetDate, amountLeft, description, selectedPhoto);
        }
      }
    });
  };
  
  

  // Navigation functions
  const nextSaving = () => {
    if (currentIndex < savings.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSaving = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };
  const today  = new Date().toISOString().split('T')[0];
  return (
    <div className="subgrid-two-item grid-common grid-c6">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Savings</h3>
        <button className="grid-c-title-icon" onClick={() => showSavingDialog()}>
          <img src={iconsImgs.plus} alt="Add" />
        </button>
      </div>
      <div className="grid-c6-content">
        <div className="grid-items">
          {savings.length === 0 ? (
            <p>No savings entries found.</p>
          ) : (
            <div className="grid-item" key={savings[currentIndex]._id}>
              <div className="grid-item-top">
                <div className="grid-item-top-l">
                  <div className="avatar img-fit-cover">
                    {/* Ensure the photo URL is correct */}
                    { savings[currentIndex].photo ? (
                          <img
                              src={`http://localhost:5000${savings[currentIndex].photo}`}
                              alt="User"
                          />
                      ) : null }

                  </div>
                  <p className="text text-silver-v1">{savings[currentIndex].description}</p>
                </div>
                <div className="grid-item-top-r">
                  <span className="text-silver-v1">$ {savings[currentIndex].amount}</span>
                  {/* Move the buttons below the amount display */}
                  <div className="income-button-group">
                    <button onClick={() => showSavingDialog(savings[currentIndex])} className="income-edit-button">Edit</button>
                    <button onClick={() => deleteSaving(savings[currentIndex]._id)} className="income-delete-button">Delete</button>
                  </div>
                </div>
              </div>
              <div className="grid-item-bottom">
                <div className="grid-item-badges">
                  <span className="grid-item-badge">Target Date: {new Date(savings[currentIndex].targetDate).toLocaleDateString()}</span>
                  <span className="grid-item-badge">Amount Left: $ {savings[currentIndex].amountLeft}</span>
                </div>
                <div className="grid-item-progress">
                  <div className="grid-item-fill" style={{ width: `${((savings[currentIndex].amount - savings[currentIndex].amountLeft) / savings[currentIndex].amount) * 100}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="pagination-controls">
        <button onClick={prevSaving} disabled={currentIndex === 0} className="income_button">Previous</button>
        <button onClick={nextSaving} disabled={currentIndex >= savings.length - 1} className="income_button">Next</button>
      </div>
    </div>
  );
};

export default Savings;
