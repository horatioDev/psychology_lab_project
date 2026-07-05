import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { sendEmail } from '../utils/sendEmail.js';

const router = Router();

router.post('/send', protect, async (req, res, next) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'to, subject, and message are required',
      });
    }

    const data = await sendEmail({
      to,
      subject,
      html: `<p>${message}</p>`,
      text: message,
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;
