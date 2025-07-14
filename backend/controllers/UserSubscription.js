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
exports.getallSubscriptionPlansPrice=async(req,res)=>{
   try {
    // Fetch all active subscriptions
    const subscriptions = await Subscription.find({ status: 'active' });

    // Fetch all plans (you could optimize by matching only used stripePriceIds)
    const plans = await SubscriptionPlan.find({ isActive: true });

       // Map: stripePriceId → { price, business_type }
    const planMap = {};
    plans.forEach(plan => {
      planMap[plan.stripePriceId] = {
        price: plan.price,
        business_type: plan.business_type
      };
    });

     let totalEarnings = 0;

    const earningsByType = {
      Salon: 0,
      Hotel: 0,
      Hospital: 0
    };

    subscriptions.forEach(sub => {
      const plan = planMap[sub.stripePriceId];
      if (plan) {
        totalEarnings += plan.price;
        earningsByType[plan.business_type] += plan.price;
      }
    });
    // Format total
    const totalamount = `${Math.round(totalEarnings / 1000)}k`;
    // Calculate percentage breakdown
    const percentageByType = {};
    for (const type of ['Salon', 'Hotel', 'Hospital','flat-owner']) {
      const earning = earningsByType[type] || 0;
      percentageByType[type] = totalEarnings > 0
        ? ((earning / totalEarnings) * 100).toFixed(2) + '%'
        : '0%';
    }
    res.json({
      totalEarnings,
      totalamount,
      percentageByBusinessType: percentageByType
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
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