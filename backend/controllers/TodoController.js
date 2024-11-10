const Todo = require('../models/Todo');


// Function to validate the dateTime
const isValidDateTime = (dateTime) => {
    const now = new Date();
    const inputDateTime = new Date(dateTime);
    return inputDateTime > now; // Ensure the dateTime is in the future
};

// Add a new todo
// Add a new todo
const addTodo = async (req, res) => {
    const { title, dateTime, description } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ message: 'Title is required and must be a non-empty string.' });
    }

    if (!dateTime || !isValidDateTime(dateTime)) {
        return res.status(400).json({ message: 'The date and time must be a valid future date.' });
    }

    const todo = new Todo({
        user: req.user.id,
        title,
        dateTime,
        description
    });

    try {
        const createdTodo = await todo.save();

        res.status(201).json(createdTodo);
    } catch (error) {
        res.status(400).json({ message: 'Invalid todo data' });
    }
};


// Get todos for the logged-in user
const getUserTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).populate('user', 'name email');
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Edit a todo
const editTodo = async (req, res) => {
    const { title, dateTime, description } = req.body;
    const todoId = req.params.id;

    // Validation
    if (title && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ message: 'Title must be a non-empty string.' });
    }

    if (dateTime && !isValidDateTime(dateTime)) {
        return res.status(400).json({ message: 'The date and time must be a valid future date.' });
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            { title, dateTime, description },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: 'Invalid todo data' });
    }
};

// Delete a todo
const deleteTodo = async (req, res) => {
    const todoId = req.params.id;

    try {
        const todo = await Todo.findByIdAndDelete(todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { addTodo, getUserTodos, editTodo, deleteTodo};
