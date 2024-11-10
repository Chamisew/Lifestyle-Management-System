const express = require('express');
const router = express.Router();
const {createActivity,getAllActivities,updateActivity,deleteActivity,} = require('../controllers/activityController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.post('/activities', createActivity);
router.get('/activities', getAllActivities);
router.put('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);


module.exports = router;
