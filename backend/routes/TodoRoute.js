const express = require('express');
const { addTodo, getUserTodos, editTodo, deleteTodo } = require('../controllers/TodoController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Route to add a todo
router.post('/', addTodo);

// Route to get user's todos
router.get('/', getUserTodos);

// Route to edit a todo
router.put('/:id', editTodo);

// Route to delete a todo
router.delete('/:id', deleteTodo);

module.exports = router;
