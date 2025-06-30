const mongoose = require('mongoose');
const subscriptionPlanSchema = new mongoose.Schema({
  plan_name: { type: String, required: true },
  plan_description:{ type: String, required: true },
  business_type: { 
    type: String,
    required: true 
  },
  billing_options: 
    {
      type: String,
      required: true
    },
  // Monthly billing fields
  price: {
    type: Number,
    required: true
  },
  stripePriceId: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    default: []
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });
module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

