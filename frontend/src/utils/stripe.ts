import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export type CreateSubscriptionParams = {
  userId: number | string;
  email: string;
  priceId: string;
  planName: string;
  billingType: 'monthly' | 'yearly';
};

export const createSubscription = async ({
  userId,
  email,
  priceId,
  planName,
  billingType,
}: CreateSubscriptionParams) => {
  try {
    console.log(JSON.stringify({ userId, email, priceId, planName, billingType }))
    const response = await fetch('http://localhost:8080/api/v1/user-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email, priceId, planName, billingType }),
    });
    //console.log(userId,'User_ID', email,'Email_id', priceId,'Price_id', planName,'PlanName', billingType,'BillingType')
    const data = await response.json();

    if (!response.ok || !data.sessionId) {
      toast.error(data.error || 'Failed to create Stripe session');
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
      toast.error('Stripe failed to load');
      return;
    }

    await stripe.redirectToCheckout({ sessionId: data.sessionId });
  } catch (error: any) {
    toast.error(error.message || 'Subscription failed');
  }
};
