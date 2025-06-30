const express = require('express');
const router = express.Router();
const deliveryPersonController = require('../controllers/DeliveryPerson');

// Create new delivery person
router
    .post('/', deliveryPersonController.createDeliveryPerson)
    .get('/', deliveryPersonController.getAllDeliveryPersons)
    .get('/:id', deliveryPersonController.getDeliveryPerson)
    .put('/:id', deliveryPersonController.updateDeliveryPerson)
    .delete('/:id', deliveryPersonController.deleteDeliveryPerson)
module.exports = router;
