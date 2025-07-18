const express = require('express');
const router = express.Router();
const UserSubscriptionController = require('../controllers/UserSubscription');

// Create new subscription plan
router
    .post('/', UserSubscriptionController.createUserSubscription)
    .get('/:slug', UserSubscriptionController.getAllUserSubscription)
    .get('/',UserSubscriptionController.getallSubscriptionPlansPrice)
    .get('/:userId', UserSubscriptionController.getSingleSubscriptionPlans)
    .put('/:id', UserSubscriptionController.upgradeUserSubscription)
    .post('/:subscriptionId',UserSubscriptionController.cancelUserSubscription)
    .delete('/:id', UserSubscriptionController.deleteUserSubscription);

module.exports = router;
