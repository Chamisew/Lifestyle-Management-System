const express = require('express');
const router = express.Router();
const serviceStationController = require('../controllers/serviceStationController');

router.post('/', serviceStationController.createServiceStation);
router.get('/', serviceStationController.getServiceStations);
router.put('/:id', serviceStationController.updateServiceStation);
router.delete('/:id', serviceStationController.deleteServiceStation);

module.exports = router;
