const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const UserSubscription = require('../models/UserSubscription');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
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
    const currentPeriodEndUnix = subscription.items.data[0].current_period_end;
    //console.log(JSON.stringify(subscription, null, 2));

    await UserSubscription.create({
      userId: session.metadata.userId,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      planName: session.metadata.planName || 'N/A',
      billingInterval: subscription.items.data[0].price.recurring.interval,
      status: subscription.status,
      startDate: new Date(subscription.start_date * 1000),
      currentPeriodEnd: currentPeriodEndUnix ? new Date(currentPeriodEndUnix * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false
    });
  }
  if (event.type === 'customer.subscription.updated') {
  const subscription = event.data.object;

  await UserSubscription.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  );
}
  res.status(200).send('Webhook received');
});
module.exports = router;
