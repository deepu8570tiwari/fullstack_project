const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/UserSubscription');
const SubscriptionPlan = require('../models/SubscriptionPlan');

// 1. Create New Subscription
exports.createUserSubscription = async (req, res) => {
  try {
    const { userId, email, planName, priceId } = req.body;
    const existingSubscription = await Subscription.findOne({
      userId,
      status: { $in: ['active', 'trialing'] },
      cancelAtPeriodEnd: false,
    });

    if (existingSubscription) {
      return res.status(400).json({
        error: 'You already have an active subscription. Please cancel or upgrade your current plan before purchasing a new one.',
      });
    }

    let customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data.length > 0 ? customers.data[0] : await stripe.customers.create({ email });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'http://localhost:5173/subscription-history?success=true',
      cancel_url: 'http://localhost:5173/subscription-plans?cancelled=true',
      metadata: {
        userId,
        planName
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(400).json({ error: error.message });
  }
};

// 2. Get All Subscription Plans by Business Type
exports.getAllUserSubscription = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ business_type: { $regex: `^${req.params.slug}$`, $options: 'i' } });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get All Subscriptions for a User
exports.getSingleSubscriptionPlans = async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.params.userId });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upgrade Subscription
exports.upgradeUserSubscription = async (req, res) => {
  const { newPriceId } = req.body;
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });

    const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
    const itemId = stripeSub.items.data[0].id;

    const updated = await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: 'create_prorations',
    });

    // Update MongoDB
    sub.stripePriceId = newPriceId;
    sub.billingInterval = updated.items.data[0].price.recurring.interval;
    sub.planName = updated.items.data[0].price.nickname;
    sub.status = updated.status;
    sub.currentPeriodEnd = new Date(updated.current_period_end * 1000);
    await sub.save();

    res.json({ message: 'Subscription upgraded', sub });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel Subscription (at end of billing period)
exports.cancelUserSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ stripeSubscriptionId: req.params.subscriptionId });
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    const endDate = new Date(sub.currentPeriodEnd).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    sub.cancelAtPeriodEnd = true;
    await sub.save();
      res.json({
        message: `Your subscription has been set to cancel at the end of your current billing period. You will continue to have access until ${endDate}.`
      });
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete Subscription (from Stripe + MongoDB)
exports.deleteUserSubscription = async (req, res) => {
  try {
    const sub = await UserSubscription.findById(req.params.id);
    if (!sub) return res.status(404).send("Not found");

    await stripe.subscriptions.del(sub.stripeSubscriptionId);
    await UserSubscription.findByIdAndDelete(req.params.id);

    res.send({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};