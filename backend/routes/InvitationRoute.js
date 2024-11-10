const express = require('express');
const { sendInvitation } = require('../controllers/InvitationController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect the route with the authentication middleware
router.use(authenticateToken);

// Define the route for sending invitations
router.post('/invitation/:id', sendInvitation);

module.exports = router;
