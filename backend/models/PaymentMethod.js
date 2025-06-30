const mongoose=require('mongoose');
const paymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  stripePaymentMethodId: String,
  brand: String,
  last4: String,
  expMonth: Number,
  expYear: Number,
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);