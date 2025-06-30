const express= require('express');
const router = express.Router();
const subscriptionPlanController = require('../controllers/SubscriptionPlan');
// Create new subscription plan
router
    .post('/', subscriptionPlanController.createSubscriptionPlan)
    .get('/', subscriptionPlanController.getAllSubscriptionPlans)
    .get('/:slug', subscriptionPlanController.getAllSubscriptionPlansType)
    .put('/:id', subscriptionPlanController.updateSubscriptionPlan)
    .delete('/:id', subscriptionPlanController.deleteSubscriptionPlan);

module.exports = router;
