const express = require("express");
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/eventsController");
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.post("/events", createEvent);
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);


module.exports = router;
