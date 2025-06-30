const mongoose=require('mongoose');

const subscriptionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  oldStatus: String,
  newStatus: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubscriptionLog', subscriptionLogSchema);