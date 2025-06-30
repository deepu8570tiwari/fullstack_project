const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentMethod = require('../models/PaymentMethod');
const User = require('../models/Admin');

exports.createPaymentMethod = async (req, res) => {
  try {
    const { userId, paymentMethodId } = req.body;
    console.log(req.body);
    if (!userId || !paymentMethodId) {
      return res.status(400).json({ error: 'Missing userId or paymentMethodId' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 🏦 Create Stripe customer if missing
    if (!user.stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        metadata: { mongoUserId: user._id.toString() },
      });
      user.stripeCustomerId = stripeCustomer.id;
      await user.save();
    }
    const attachedPM = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId,
    });
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    const paymentMethod = new PaymentMethod({
      userId: user._id,
      stripePaymentMethodId: attachedPM.id,
      brand: attachedPM.card.brand,
      last4: attachedPM.card.last4,
      expMonth: attachedPM.card.exp_month,
      expYear: attachedPM.card.exp_year,
      isDefault: false, // You can default this here
    });

    await paymentMethod.save();

    // ✅ Success
    res.status(201).json(paymentMethod);

  } catch (err) {
    console.error('Error adding payment method:', err);
    // Handle Stripe-specific errors
    if (err.raw && err.raw.message) {
      return res.status(400).json({ error: `Stripe: ${err.raw.message}` });
    }
    res.status(400).json({ error: err.message || 'Failed to add payment method' });
  }
};


// ✅ Get all payment methods for all users
exports.getAllPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find().populate('userId');
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get a specific payment method
exports.getPaymentMethod = async (req, res) => {
   try {
    console.log('Getting cards for userId:', req.params.id);
    const methods = await PaymentMethod.find({ userId: req.params.id }).populate('userId');
    if (!methods || methods.length === 0) {
      return res.status(404).json({ error: 'No payment methods found' });
    }
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update Payment Method (Mongo-only update, not Stripe card data)
exports.updatePaymentMethod = async (req, res) => {
  try {
    const updated = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      req.body, // Only things like isDefault or custom flags
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Payment method not found' });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Set Default Card
exports.setDefaultPaymentMethod = async (req, res) => {
   try {
    const { userId, paymentMethodId } = req.body;
    if (!userId || !paymentMethodId) {
      return res.status(400).json({ error: 'Missing userId or paymentMethodId' });
    }
    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ error: 'User or Stripe customer not found' });
    }
    // 1. Attach the payment method to the customer if not already
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId,
    }).catch((err) => {
      if (err.code !== 'resource_already_attached') throw err;
    });
    // 2. Set as default on Stripe
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    // 3. Update DB: Only one default
    await PaymentMethod.updateMany({ userId }, { isDefault: false });

    const updatedMethod = await PaymentMethod.findOneAndUpdate(
      { userId, stripePaymentMethodId: paymentMethodId },
      { isDefault: true },
      { new: true }
    );
    if (!updatedMethod) {
      return res.status(404).json({ error: 'Payment method not found in DB' });
    }
    res.json({ message: 'Default payment method updated', updatedMethod });

  } catch (err) {
    console.error('[Set Default Payment Error]', err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Card (from Stripe and MongoDB)
exports.deletePaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findById(req.params.id);
    if (!method) return res.status(404).json({ error: 'Method not found' });
    // Detach from Stripe
    await stripe.paymentMethods.detach(method.stripePaymentMethodId);

    // Delete from DB
    await method.deleteOne();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
