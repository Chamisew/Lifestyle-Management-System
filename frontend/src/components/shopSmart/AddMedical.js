import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import logo from '../../MEETIMAGES/Household lifestyle partner-01-01.png';
import 'jspdf-autotable';
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import "./shopSmart.css"

const AddMedical = () => {
    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [description, setDescription] = useState('');
    const [medicals, setMedicals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMedicals = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/medicals', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMedicals(response.data);
        } catch (error) {
            Swal.fire('Error!', 'Failed to fetch medical records. Please try again.', 'error');
        }
    };

    useEffect(() => {
        fetchMedicals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isDateInFuture(dateTime)) {
            return Swal.fire('Error!', 'Please select a date in the future.', 'error');
        }
        try {
            if (title && dateTime && description) {
                await axios.post('http://localhost:5000/api/medicals',
                    { title, dateTime, description },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                Swal.fire('Added!', 'The medical record has been added.', 'success');
                resetForm();
                fetchMedicals();
            } else {
                Swal.fire('Error!', 'Please fill in all fields.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to save medical record. Please try again.', 'error');
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
            await axios.put(`http://localhost:5000/api/medicals/${id}`,
                { title, dateTime, description },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            Swal.fire('Updated!', 'The medical record has been updated.', 'success');
            fetchMedicals();
        } catch (error) {
            Swal.fire('Error!', 'Failed to update medical record. Please try again.', 'error');
        }
    };

    const deleteMedical = async (id) => {
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
                await axios.delete(`http://localhost:5000/api/medicals/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                Swal.fire('Deleted!', 'The medical record has been deleted.', 'success');
                fetchMedicals();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete medical record. Please try again.', 'error');
            }
        }
    };

    const blueColors = [
        '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', 
        '#26c6da', '#00bcd4', '#00acc1', '#0097a7'
    ];

    const downloadPDF = (medical) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.addImage(logo, 'PNG', 10, 10, 20, 20);
        doc.text('Medical Items List Details', 10, 35);
        
        doc.setFontSize(12);
        doc.autoTable({
            head: [['Title', 'Date & Time', 'Description']],
            body: [[medical.title, new Date(medical.dateTime).toLocaleString(), medical.description]],
            startY: 45,
            styles: { cellPadding: 5, fontSize: 12 },
            theme: 'grid'
        });
        doc.save(`${medical.title}.pdf`);
    };

    const isDateInFuture = (date) => {
        return new Date(date) > new Date();
    };

    // Function to display description with line breaks
    const formatDescription = (description) => {
        return description.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    // Filter medical records based on search query
    const filteredMedicals = medicals.filter(medical =>
        medical.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medical.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className ='shopsmartb'>
         <Nav/>
            <div>
             
                <div className='shopsmart'>
                <div className="shopsmart-container">
    <div className="shopsmart-form-container">
        <h2 className="shopsmart-form-title">Add Medical Items List</h2>
        <form onSubmit={handleSubmit}>
            <input
                className="shopsmart-form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <input
                className="shopsmart-form-input"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
                min={new Date().toISOString().slice(0, 16)}
            />
            <textarea
                className="shopsmart-form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <button type="submit" className="shopsmart-submit-button">Add</button>
        </form>
    </div>

    <div className="shopsmart-list">
        <h4>Medical Items List</h4>
        <input
            type="text"
            placeholder="Search......."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shopsmart--input"
        />
        {filteredMedicals.length > 0 ? (
            filteredMedicals.map((medical, index) => (
                <div key={medical._id} 
                className="shopsmart-item"
                style={{ backgroundColor: blueColors[index % blueColors.length] }} 
                >
                    <h3 className="shopsmart-item-title">{medical.title}</h3>
                    <p className="shopsmart-item-date">{new Date(medical.dateTime).toLocaleString()}</p>
                    <p className="shopsmart-item-description">{formatDescription(medical.description)}</p>
                    
                    <div className="buttonGroup">
                        <button onClick={() => openEditAlert(medical)} className="shopsmart-button-style">Edit</button>
                        <button onClick={() => deleteMedical(medical._id)} className="shopsmart-button-style">Delete</button>
                        <button onClick={() => downloadPDF(medical)} className="shopsmart-button-style">Download</button>
                    </div>
                </div>
            ))
        ) : (
            <p>No medical records found.</p>
        )}
    </div>
</div>
</div>
<Footer/>
        </div>
        </div>
    );
};

export default AddMedical;
