const express = require('express');
const {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
 
} = require('../controllers/goalController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(authenticateToken);

router.get("/", getGoals);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

module.exports = router;
