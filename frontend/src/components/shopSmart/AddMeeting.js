import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import logo from '../../MEETIMAGES/Household lifestyle partner-01-01.png';
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import "./shopSmart.css"

const AddMeeting = () => {
    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [description, setDescription] = useState('');
    const [meetings, setMeetings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [,setLoading] = useState(false);

    const fetchMeetings = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/meetings', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMeetings(response.data);
        } catch (error) {
            Swal.fire('Error!', 'Failed to fetch meetings. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const isDateInFuture = (date) => {
        return new Date(date) > new Date();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title && dateTime && description) {
            if (!isDateInFuture(dateTime)) {
                return Swal.fire('Error!', 'The meeting date must be in the future.', 'error');
            }

            setLoading(true);
            try {
                await axios.post('http://localhost:5000/api/meetings', 
                    { title, dateTime, description }, 
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                Swal.fire('Added!', 'The meeting has been added.', 'success');
                resetForm();
                fetchMeetings();
            } catch (error) {
                Swal.fire('Error!', 'Failed to save meeting. Please try again.', 'error');
            } finally {
                setLoading(false);
            }
        } else {
            Swal.fire('Error!', 'Please fill in all fields.', 'error');
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
        setLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/meetings/${id}`, 
                { title, dateTime, description }, 
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            Swal.fire('Updated!', 'The meeting has been updated.', 'success');
            fetchMeetings();
        } catch (error) {
            Swal.fire('Error!', 'Failed to update meeting. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const deleteMeeting = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete this list.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:5000/api/meetings/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                Swal.fire('Deleted!', 'The meeting has been deleted.', 'success');
                fetchMeetings();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete meeting. Please try again.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const blueColors = [
        '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', 
        '#26c6da', '#00bcd4', '#00acc1', '#0097a7'
    ];

    const downloadMeetingPDF = (meeting) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.addImage(logo, 'PNG', 10, 10, 20, 20);
        doc.text('Meeting Items List Details', 10, 35);
        
        doc.setFontSize(12);
        doc.autoTable({
            head: [['Title', 'Date & Time', 'Description']],
            body: [[meeting.title, new Date(meeting.dateTime).toLocaleString(), meeting.description]],
            startY: 45,
            styles: { cellPadding: 5, fontSize: 12 },
            theme: 'grid'
        });
        
        doc.save(`${meeting.title}.pdf`);
    };

    const filteredMeetings = meetings.filter(meeting =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className ='shopsmartb'>
            <Nav/>
            <div>
              
                <div className='shopsmart'>
                <div className="shopsmart-container">
    <div className="shopsmart-form-container">
        <h2 className="shopsmart-form-title">Add Meeting Items List</h2>
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
            />
            <button type="submit" className="shopsmart-submit-button">
                Add
            </button>
        </form>
    </div>

    <div className="shopsmart-list">
        <h4>Meeting Items List</h4>

        <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search......."
            className="shopsmart--input"
        />
        </div>
        <div className="shopsmart-list">
            {filteredMeetings.map((meeting, index) => (
                <div key={meeting._id} 
                className="shopsmart-item"
                style={{ backgroundColor: blueColors[index % blueColors.length] }} 
                >
                    <h3 className="shopsmart-item-title">{meeting.title}</h3>
                    <p className="shopsmart-item-date">{new Date(meeting.dateTime).toLocaleString()}</p>
                 
                        {meeting.description.split('\n').map((line, index) => (
                            <p key={index} className="shopsmart-item-description">{line}</p>
                        ))}
                    
    <div className="buttonGroup">
    <button 
        onClick={() => openEditAlert(meeting)} 
        className="shopsmart-button-style"
    >
        Edit
    </button>
    <button 
        onClick={() => deleteMeeting(meeting._id)} 
        className="shopsmart-button-style"
    >
        Delete
    </button>
    <button 
        onClick={() => downloadMeetingPDF(meeting)} 
        className="shopsmart-button-style"
    >
        Download
    </button>
</div>
                </div>
            ))}
        
    </div>
</div>
</div>
<Footer/>
            </div>
        </div>
    );
};

export default AddMeeting;
