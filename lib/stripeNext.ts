import Stripe from 'stripe';

const stripeConfig = new Stripe(process.env.STRIPE_SECRET || '', {
  apiVersion: '2022-08-01',
});

export default stripeConfig;
