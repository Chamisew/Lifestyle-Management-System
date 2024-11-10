const express = require('express');
const { getMedications, addMedication } = require('../controllers/HealthMateMedicationController');
const router = express.Router();

router.get('/', getMedications);
router.post('/', addMedication);

module.exports = router;
