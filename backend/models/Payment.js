const mongoose=require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSubscription' },
  stripeInvoiceId: String,
  amountPaid: Number,
  currency: String,
  paymentMethod: String,
  status: { type: String, enum: ['succeeded', 'failed'] },
  paidAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

