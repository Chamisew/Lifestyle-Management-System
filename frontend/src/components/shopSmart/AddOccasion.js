import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import logo from '../../MEETIMAGES/Household lifestyle partner-01-01.png';
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import "./shopSmart.css"

const AddOccasion = () => {
    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [description, setDescription] = useState('');
    const [occasions, setOccasions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchOccasions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/occasions', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOccasions(response.data);
        } catch (error) {
            Swal.fire('Error!', 'Failed to fetch occasions. Please try again.', 'error');
        }
    };

    useEffect(() => {
        fetchOccasions();
    }, []);

    const isDateInFuture = (date) => {
        return new Date(date) > new Date();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (title && dateTime && description) {
                if (!isDateInFuture(dateTime)) {
                    Swal.fire('Error!', 'The date must be in the future.', 'error');
                    return;
                }
                await axios.post('http://localhost:5000/api/occasions', 
                    { title, dateTime, description }, 
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                Swal.fire('Added!', 'The occasion has been added.', 'success');
                resetForm();
                fetchOccasions();
            } else {
                Swal.fire('Error!', 'Please fill in all fields.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to save occasion. Please try again.', 'error');
        }
    };

    const resetForm = () => {
        setTitle('');
        setDateTime('');
        setDescription('');
    };

    const openEditAlert = (event) => {
        const formattedDate = new Date(event.dateTime).toISOString().slice(0, 16);
        const currentDate = new Date().toISOString().slice(0, 16);
    
        Swal.fire({
            title: 'Edit',
            html: ` 
                <input id="swal-input1" class="swal2-input" placeholder="Title" value="${event.title}" required>
                <input id="swal-input2" class="swal2-input" type="datetime-local" value="${formattedDate}" min="${currentDate}" required>
                <textarea id="swal-input3" class="swal2-textarea" placeholder="Description" required>${event.description}</textarea>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const title = document.getElementById('swal-input1').value;
                const dateTime = document.getElementById('swal-input2').value;
                const description = document.getElementById('swal-input3').value;
                if (!title || !dateTime || !description) {
                    Swal.showValidationMessage('Please fill in all fields');
                    return false;
                }
    
                const selectedDate = new Date(dateTime);
                const currentDate = new Date();
                if (selectedDate <= currentDate) {
                    Swal.showValidationMessage('The date and time must be in the future.');
                    return false;
                }
    
                return { title, dateTime, description };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await handleUpdate(event._id, result.value.title, result.value.dateTime, result.value.description);
            }
        });
    };
    
    const handleUpdate = async (id, title, dateTime, description) => {
        try {
            await axios.put(`http://localhost:5000/api/occasions/${id}`, 
                { title, dateTime, description }, 
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            Swal.fire('Updated!', 'The occasion has been updated.', 'success');
            fetchOccasions();
        } catch (error) {
            Swal.fire('Error!', 'Failed to update occasion. Please try again.', 'error');
        }
    };

    const deleteOccasion = async (id) => {
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
                await axios.delete(`http://localhost:5000/api/occasions/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                Swal.fire('Deleted!', 'The occasion has been deleted.', 'success');
                fetchOccasions();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete occasion. Please try again.', 'error');
            }
        }
    };

    const blueColors = [
        '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', 
        '#26c6da', '#00bcd4', '#00acc1', '#0097a7'
    ];

    const downloadPDF = (occasion) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        // Add your logo here, ensure 'logo' variable is defined
        doc.addImage(logo, 'PNG', 10, 10, 20, 20); // Adjust logo as needed
        doc.text('Occasion Items List Details', 10, 35);
    
        doc.setFontSize(12);
        doc.autoTable({
            head: [['Title', 'Date & Time', 'Description']],
            body: [[occasion.title, new Date(occasion.dateTime).toLocaleString(), occasion.description]],
            startY: 45,
            styles: { cellPadding: 5, fontSize: 12 },
            theme: 'grid'
        });
    
        doc.save(`${occasion.title}.pdf`);
    };

    const filteredOccasions = occasions.filter((occasion) =>
        occasion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        occasion.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className ='shopsmartb'>
           <Nav/>
            <div className="add-occasion-container">
            
            <div className='shopsmart'>
                <div className="shopsmart-container">
    <div className="shopsmart-form-container">
        <h2 className="shopsmart-form-title">Add Occasion Items List</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
                className="shopsmart-form-input"
            />
            <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="shopsmart-form-input"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Items"
                required
                className="shopsmart-form-input"
                rows="3"
            />
            <button type="submit" className="shopsmart-submit-button">
                Add
            </button>
        </form>
    </div>

    {/* List of occasions */}
    <div className="shopsmart-list">
        <h4>Occasion Items List</h4>
        {/* Search Bar */}
        
            <input
                type="text"
                placeholder="Search......."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shopsmart--input"
            />
        
        {filteredOccasions.length > 0 ? (
            filteredOccasions.map((occasion, index) => (
                <div key={occasion._id} 
                className="shopsmart-item"
                style={{ backgroundColor: blueColors[index % blueColors.length] }} 
                >
                    <h3>{occasion.title}</h3>
                    <p>{new Date(occasion.dateTime).toLocaleString()}</p>
                    <p>
                        {occasion.description.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>
                    <div className="buttonGroup">
                        <button onClick={() => openEditAlert(occasion)} className="shopsmart-button-style">Edit</button>
                        <button onClick={() => deleteOccasion(occasion._id)} className="shopsmart-button-style">Delete</button>
                        <button onClick={() => downloadPDF(occasion)} className="shopsmart-button-style">Download</button>
                    </div>
                </div>
            ))
        ) : (
            <p>No occasions found</p>
        )}
    </div>
</div>
</div>
<Footer/> 
            </div>
        </div>
    );
};

export default AddOccasion;
