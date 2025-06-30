const express = require('express');
const router = express.Router();
const UserSubscriptionController = require('../controllers/UserSubscription');

// Create new subscription plan
router
    .post('/', UserSubscriptionController.createUserSubscription)
    .get('/', UserSubscriptionController.getAllUserSubscription)
    .get('/:userId', UserSubscriptionController.getSingleSubscriptionPlans)
    .put('/:id', UserSubscriptionController.updateUserSubscription)
    .delete('/:id', UserSubscriptionController.deleteUserSubscription);

module.exports = router;
