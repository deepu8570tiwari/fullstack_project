const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SubscriptionPlan = require('../models/SubscriptionPlan');

exports.createSubscriptionPlan = async (req, res) => {
  const {
  plan_name, plan_description, price,
  billing_options, business_type, features
} = req.body;

try {
  const yearlyProduct = await stripe.products.create({
    name: `${plan_name} ${billing_options}`,
    description: `${plan_description || plan_name}`,
    metadata: {
      features: JSON.stringify(features)
    }
  });
  const interval = billing_options === "monthly" ? "month" : "year";

  const yearlyPrice = await stripe.prices.create({
    unit_amount: price * 100,
    currency: 'inr',
    recurring: { interval }, // ✅ Clean and clear
    product: yearlyProduct.id,
  });

  const stripePriceId = yearlyPrice.id; // ✅ Declare a new const

  const newPlan = new SubscriptionPlan({
    plan_name,
    plan_description,
    price,
    billing_options,
    business_type,
    features,
    stripePriceId
  });

  await newPlan.save();
  res.status(201).json(newPlan);
} catch (err) {
  res.status(500).json({ error: err.message });
}
};


exports.getAllSubscriptionPlansType = async (req, res) => {
try {
    const plans = await SubscriptionPlan.find({'business_type':{ $regex: `^${req.params.slug}$`, $options: 'i' }});
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSubscriptionPlans = async (req, res) => {
try {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSubscriptionPlan = async (req, res) => {

 try {
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSubscriptionPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    // Optionally: delete from Stripe
    if (plan.stripePriceIdMonthly) await stripe.prices.update(plan.stripePriceIdMonthly, { active: false });
    if (plan.stripePriceIdYearly) await stripe.prices.update(plan.stripePriceIdYearly, { active: false });

    await plan.deleteOne();
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
