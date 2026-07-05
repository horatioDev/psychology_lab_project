import { Router } from 'express';
import { Sentry } from '../config/sentry.js';
import userRoutes from './users.js';
import uploadRoutes from './upload.js';
import emailRoutes from './email.js';
import stripeRoutes from './stripe.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/email', emailRoutes);
router.use('/stripe', stripeRoutes);

/** Intentional test route — triggers a Sentry error when called. */
router.get('/sentry-test', (_req, _res) => {
  throw new Error('Sentry backend test error — this is intentional');
});

router.get('/sentry-capture', (_req, res) => {
  Sentry.captureMessage('Sentry backend test message', 'info');
  res.json({ success: true, message: 'Test message sent to Sentry' });
});

export default router;
