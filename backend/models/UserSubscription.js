const mongoose = require('mongoose');

const UserSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  stripeSubscriptionId: String,
  stripeCustomerId: String,
  stripePriceId: String,
  planName: String,
  billingInterval: String, // <-- Rename from billingType
  status: {
    type: String,
    enum: [
      'active',
      'canceled',
      'incomplete',
      'incomplete_expired',
      'trialing',
      'past_due',
      'unpaid',
    ],
    default: 'incomplete',
  },
  startDate: Date,
  currentPeriodEnd: Date, // <-- Required for cancel/renew logic
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Adds createdAt & updatedAt automatically
});

module.exports = mongoose.model('UserSubscription', UserSubscriptionSchema);
