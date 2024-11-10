import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import logo from '../../MEETIMAGES/Household lifestyle partner-01-01.png'; 
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import './shopSmart.css'; 

const AddVehicle = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchVehicles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vehicle', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setVehicles(response.data);
        } catch (error) {
            Swal.fire('Error!', 'Failed to fetch vehicles. Please try again.', 'error');
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const isFutureDateTime = (dateTime) => {
        return new Date(dateTime) > new Date();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateTime = new Date(`${date}T${time}`);
        
        if (title && description && date && time && isFutureDateTime(dateTime)) {
            try {
                await axios.post('http://localhost:5000/api/vehicle', 
                    { title, description, date, time }, 
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                Swal.fire('Added!', 'The vehicle has been added.', 'success');
                resetForm();
                fetchVehicles();
            } catch (error) {
                Swal.fire('Error!', 'Failed to save vehicle. Please try again.', 'error');
            }
        } else {
            Swal.fire('Error!', 'Please fill in all fields with valid future dates and times.', 'error');
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
    };

    const openEditAlert = (vehicle) => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        
        Swal.fire({
            title: 'Edit',
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Title" value="${vehicle.title}" required>
                <textarea id="swal-input2" class="swal2-textarea" placeholder="Description" required>${vehicle.description}</textarea>
                <input id="swal-input3" class="swal2-input" type="date" value="${vehicle.date.split('T')[0]}" required min="${today}">
                <input id="swal-input4" class="swal2-input" type="time" value="${vehicle.time}" required>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const title = document.getElementById('swal-input1').value;
                const description = document.getElementById('swal-input2').value;
                const date = document.getElementById('swal-input3').value;
                const time = document.getElementById('swal-input4').value;
                const dateTime = new Date(`${date}T${time}`);
                
                if (!title || !description || !date || !time || !isFutureDateTime(dateTime)) {
                    Swal.showValidationMessage('Please fill in all fields with valid future dates and times');
                }
                return { title, description, date, time };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await handleUpdate(vehicle._id, result.value.title, result.value.description, result.value.date, result.value.time);
            }
        });
    };
    

    const handleUpdate = async (id, title, description, date, time) => {
        const dateTime = new Date(`${date}T${time}`);
        
        if (isFutureDateTime(dateTime)) {
            try {
                await axios.put(`http://localhost:5000/api/vehicle/${id}`, 
                    { title, description, date, time }, 
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                Swal.fire('Updated!', 'The vehicle has been updated.', 'success');
                fetchVehicles();
            } catch (error) {
                Swal.fire('Error!', 'Failed to update vehicle. Please try again.', 'error');
            }
        } else {
            Swal.fire('Error!', 'Please select a valid future date and time.', 'error');
        }
    };

    const deleteVehicle = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete this list.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/vehicle/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                Swal.fire('Deleted!', 'The vehicle has been deleted.', 'success');
                fetchVehicles();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete vehicle. Please try again.', 'error');
            }
        }
    };

    const today = new Date().toISOString().split('T')[0];

    const blueColors = [
        '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', 
        '#26c6da', '#00bcd4', '#00acc1', '#0097a7'
    ];

    const downloadVehicle = (vehicle) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.addImage(logo, 'PNG', 10, 10, 20, 20);
        doc.text('Vehicle Items List Details', 10, 35);
        
        doc.setFontSize(12);
        doc.autoTable({
            head: [['Title', 'Date & Time', 'Description']],
            body: [[vehicle.title, new Date(vehicle.dateTime).toLocaleString(), vehicle.description]],
            startY: 45,
            styles: { cellPadding: 5, fontSize: 12 },
            theme: 'grid'
        });
        
        doc.save(`${vehicle.title}.pdf`);
    };

    const filteredVehicles = vehicles.filter((vehicle) =>
        vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className ='shopsmartb'>
             <Nav/>
            <div>
                <div class="shopsmart">
                <div className="shopsmart-container">
                    <div className="shopsmart-form-container">
                        <h2 className="shopsmart-form-title">Add Vehicle Items List</h2>
                        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                required
                                className="shopsmart-form-input"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Items"
                                required
                                className="shopsmart--input"
                                rows="3"
                            />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                min={today}
                                className="shopsmart-form-input"
                            />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                                className="shopsmart-form-input"
                            />
                            <button
                                type="submit"
                                className="shopsmart-submit-button"
                            >
                                Add
                            </button>
                        </form>
                    </div>
                </div>

                <div className="shopsmart-list">
                <h4>Vehicle Items List</h4>
                    <input
                        type="text"
                        placeholder="Search......."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="shopsmart-form-input"
                    />
                    {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle, index) => (
                            <div key={vehicle._id} 
                            className="shopsmart-item"
                            style={{ backgroundColor: blueColors[index % blueColors.length] }} 
                            >
                                <h3>{vehicle.title}</h3>
                                <p>{new Date(vehicle.date).toLocaleDateString()} at {vehicle.time}</p>
                                <p dangerouslySetInnerHTML={{ __html: vehicle.description.replace(/\n/g, '<br />') }}></p>

                                <div className="buttonGroup">
                                <button 
                                    onClick={() => openEditAlert(vehicle)} 
                                    className="shopsmart-button-style"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => deleteVehicle(vehicle._id)} 
                                    className="shopsmart-button-style"
                                >
                                    Delete
                                </button>
                                <button 
                                    onClick={() => downloadVehicle(vehicle)} 
                                    className="shopsmart-button-style"
                                >
                                    Download
                                </button>
                            </div>
                            </div>
                        ))
                    ) : (
                        <p>No vehicles found.</p>
                    )}
                </div>
            </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AddVehicle;
