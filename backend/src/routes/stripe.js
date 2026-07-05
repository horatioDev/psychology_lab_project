import { Router } from 'express';
import Stripe from 'stripe';
import { protect } from '../middleware/auth.js';
import { getAuth } from '@clerk/express';
import { User } from '../models/User.js';

/**
 * Stripe: no monthly platform fee on standard pricing;
 * 2.9% + 30¢ per successful card charge in the US.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = Router();

router.post('/create-checkout-session', protect, async (req, res, next) => {
  try {
    const { mode = 'subscription', priceId } = req.body;
    const { userId } = getAuth(req);

    if (!['subscription', 'payment'].includes(mode)) {
      return res.status(400).json({ success: false, message: 'Invalid mode' });
    }

    const resolvedPriceId =
      priceId ||
      (mode === 'subscription'
        ? process.env.STRIPE_PRICE_ID_SUBSCRIPTION
        : process.env.STRIPE_PRICE_ID_ONETIME);

    if (!resolvedPriceId) {
      return res.status(400).json({ success: false, message: 'Price ID not configured' });
    }

    let user = await User.findOne({ clerkId: userId });
    let customerId = user?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { clerkId: userId },
      });
      customerId = customer.id;

      if (user) {
        user.stripeCustomerId = customerId;
        await user.save();
      }
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      success_url: `${clientUrl}/pricing?success=true`,
      cancel_url: `${clientUrl}/pricing?canceled=true`,
      metadata: { clerkId: userId },
    });

    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (err) {
    next(err);
  }
});

router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const clerkId = session.metadata?.clerkId;
    if (clerkId) {
      await User.findOneAndUpdate(
        { clerkId },
        { subscriptionStatus: session.mode === 'subscription' ? 'active' : 'none' }
      );
    }
  }

  res.json({ received: true });
});

export default router;
