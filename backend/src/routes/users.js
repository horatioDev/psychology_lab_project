import { Router } from 'express';
import { getAuth } from '@clerk/express';
import { User } from '../models/User.js';
import { sendWelcomeEmail } from '../utils/sendEmail.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

/** Sync Clerk user to MongoDB and send welcome email on first sign-in. */
router.post('/sync', protect, async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const { email, name, avatarUrl } = req.body;

    let user = await User.findOne({ clerkId: userId });
    const isNew = !user;

    if (isNew) {
      user = await User.create({
        clerkId: userId,
        email: email || req.body.emailAddress,
        name: name || '',
        avatarUrl: avatarUrl || '',
      });

      if (user.email) {
        await sendWelcomeEmail({ to: user.email, name: user.name || 'there' });
      }
    } else {
      user.email = email || user.email;
      user.name = name || user.name;
      user.avatarUrl = avatarUrl || user.avatarUrl;
      await user.save();
    }

    res.json({ success: true, user, isNew });
  } catch (err) {
    next(err);
  }
});

router.get('/me', protect, async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

export default router;
