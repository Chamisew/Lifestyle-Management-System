const express = require('express');
const router = express.Router();
const { addVehicle, getUserVehicles, editVehicle, deleteVehicle } = require('../controllers/VehicleControllers');
const { authenticateToken } = require('../middleware/authMiddleware');


router.use(authenticateToken);

router.post('/', addVehicle);
router.get('/', getUserVehicles);
router.put('/:id', editVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
