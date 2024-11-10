import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import logo from '../../MEETIMAGES/Household lifestyle partner-01-01.png'; 
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import "./shopSmart.css"

const AddTodo = () => {
    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [description, setDescription] = useState('');
    const [todos, setTodos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/todos', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTodos(response.data);
        } catch (error) {
            Swal.fire('Error!', 'Failed to fetch todos. Please try again.', 'error');
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const isFutureDate = (date) => {
        return new Date(date) > new Date();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFutureDate(dateTime)) {
            return Swal.fire('Error!', 'The date and time must be in the future.', 'error');
        }
        try {
            if (title && dateTime && description) {
                await axios.post('http://localhost:5000/api/todos', 
                    { title, dateTime, description }, 
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                Swal.fire('Added!', 'The todo has been added.', 'success');
                resetForm();
                fetchTodos();
            } else {
                Swal.fire('Error!', 'Please fill in all fields.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to save todo. Please try again.', 'error');
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
            await axios.put(`http://localhost:5000/api/todos/${id}`, 
                { title, dateTime, description }, 
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            Swal.fire('Updated!', 'The todo has been updated.', 'success');
            fetchTodos();
        } catch (error) {
            Swal.fire('Error!', 'Failed to update todo. Please try again.', 'error');
        }
    };

    const deleteTodo = async (id) => {
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
                await axios.delete(`http://localhost:5000/api/todos/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                Swal.fire('Deleted!', 'The todo has been deleted.', 'success');
                fetchTodos();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete todo. Please try again.', 'error');
            }
        }
    };

     const blueColors = [
        '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', 
        '#26c6da', '#00bcd4', '#00acc1', '#0097a7'
    ];

    const downloadTodo = (todo) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.addImage(logo, 'PNG', 10, 10, 20, 20);
        doc.text('Shopping Items List Details', 10, 35);
        
        doc.setFontSize(12);
        doc.autoTable({
            head: [['Title', 'Date & Time', 'Description']],
            body: [[todo.title, new Date(todo.dateTime).toLocaleString(), todo.description]],
            startY: 45,
            styles: { cellPadding: 5, fontSize: 12 },
            theme: 'grid'
        });
        
        doc.save(`${todo.title}.pdf`);
    };

    const filteredTodos = todos.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className ='shopsmartb'>
            <Nav/>
            <div>
        
                <div className="shopsmart">
    <div className="shopsmart-container">
        <div className="shopsmart-form-container">
            <h2 className="shopsmart-form-title">Add Shopping Items List</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
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
                    className="shopsmart--input"
                    rows="3"
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
        <h4>Shopping Items List</h4>

        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search......."
            className="shopsmart-form-input"
        />

        {filteredTodos.length > 0 ? (
            filteredTodos.map((todo, index) => (
                <div key={todo._id} 
                className="shopsmart-item"
                style={{ backgroundColor: blueColors[index % blueColors.length] }} 
                >
                    <h3>{todo.title}</h3>
                    <p>{new Date(todo.dateTime).toLocaleString()}</p>
                    <p>{todo.description.split('\n').map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    ))}</p>
                    <div className="buttonGroup">
                    <button 
                        onClick={() => openEditAlert(todo)} 
                        className="shopsmart-button-style"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => deleteTodo(todo._id)} 
                        className="shopsmart-button-style"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => downloadTodo(todo)} 
                        className="shopsmart-button-style"
                    >
                        Download
                    </button>
                </div>
                </div>
            ))
        ) : (
            <p>No todos found.</p>
        )}
    </div>
</div>

<Footer/>  
            </div>
        </div>
    );
};

export default AddTodo;
