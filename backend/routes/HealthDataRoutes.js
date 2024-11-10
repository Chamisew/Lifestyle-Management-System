const express = require('express');
const { addHealthData, getHealthData, getHealthDataById, updateHealthData, deleteHealthData } = require('../controllers/HealthDataController');

const router = express.Router();

router.post('/add', addHealthData);
router.get('/viewall', getHealthData);
router.get('/view/:id', getHealthDataById);
router.put('/update/:id', updateHealthData);
router.delete('/:id', deleteHealthData);

module.exports = router;
