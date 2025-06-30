const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SubscriptionUser = require('../models/UserSubscription');
exports.createUserSubscription = async (req, res) => {
  try {
    const { email, priceId } = req.body;
    // 1. Get or create Stripe customer
    let customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data.length > 0 ? customers.data[0] : await stripe.customers.create({ email });

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'http://localhost:5173/subscription-plans?success=true', // Adjust as per your frontend route
      cancel_url: 'http://localhost:5173/subscription-plans?cancelled=true',
      metadata: {
        userId: user.id, // pass your local user ID here
        planName: planName, // optional - for easier tracking
      },
    });

    return res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', error);
    return res.status(400).json({ error: error.message });
  }
};
exports.getAllUserSubscription = async (req, res) => {
try {
    const plans = await SubscriptionPlan.find({'business_type':{ $regex: `^${req.params.slug}$`, $options: 'i' }});
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSingleSubscriptionPlans = async (req, res) => {
 const subs = await Subscription.find({ userId: req.params.userId });
  res.json(subs);
};

exports.updateUserSubscription = async (req, res) => {
    const updated = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteUserSubscription = async (req, res) => {
  const sub = await Subscription.findById(req.params.id);
  if (!sub) return res.status(404).send("Not found");

  await stripe.subscriptions.del(sub.stripeSubscriptionId);
  await Subscription.findByIdAndDelete(req.params.id);

  res.send({ success: true });
};