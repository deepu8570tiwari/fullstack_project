const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const UserSubscription = require('../models/UserSubscription');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    await UserSubscription.create({
      userId: session.metadata.userId,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      planName: session.metadata.planName || 'N/A',
      billingInterval: subscription.items.data[0].price.recurring.interval,
      status: subscription.status,
      startDate: new Date(subscription.start_date * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });
  }

  res.status(200).send('Webhook received');
});

module.exports = router;
