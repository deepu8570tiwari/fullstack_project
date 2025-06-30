const mongoose = require('mongoose');
const UsersubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  stripeSubscriptionId: String,
  stripeCustomerId: String,
  stripePriceId: String,
  status: {
    type: String,
    enum: ['active', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'past_due', 'unpaid'],
    default: 'incomplete',
  },
  planName: String,
  billingType: String, // 'monthly' or 'yearly'
  startDate: Date,
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports= mongoose.model('UserSubscription', UsersubscriptionSchema);