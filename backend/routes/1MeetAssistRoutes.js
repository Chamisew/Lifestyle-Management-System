const express = require("express");
const router = express.Router();
const meetAssistController = require('../controllers/1MeetAssistControllers');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get("/", meetAssistController.getAllMeetings);
router.post("/", meetAssistController.addMeet);
router.get("/:id", meetAssistController.getById);
router.put("/:id", meetAssistController.updateMeeting);
router.delete("/:id", meetAssistController.deleteMeeting);

module.exports = router;
