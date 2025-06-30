const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentMethod');
router.put('/default-card', paymentController.setDefaultPaymentMethod);
router
    .post('/', paymentController.createPaymentMethod)
    .get('/', paymentController.getAllPaymentMethods)
    .get('/:id', paymentController.getPaymentMethod)
    .put('/:id', paymentController.updatePaymentMethod)
    .delete('/:id', paymentController.deletePaymentMethod)

module.exports = router;
