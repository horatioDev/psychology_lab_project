import { Resend } from 'resend';
import { welcomeEmailTemplate } from './emailTemplates.js';

/**
 * Resend free tier: 3,000 emails/month, 100 emails/day.
 */
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message || 'Failed to send email');
  }

  return data;
}

export async function sendWelcomeEmail({ to, name }) {
  const { subject, html, text } = welcomeEmailTemplate(name);
  return sendEmail({ to, subject, html, text });
}
