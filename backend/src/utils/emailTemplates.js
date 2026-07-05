export function welcomeEmailTemplate(name = 'there') {
  const subject = 'Welcome to MERN Starter!';

  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #4f46e5;">Welcome, ${name}!</h1>
        <p>Thanks for signing up. Your MERN Starter account is ready.</p>
        <p>Here's what you can do next:</p>
        <ul>
          <li>Upload files to Cloudinary</li>
          <li>Explore the protected dashboard</li>
          <li>Try Stripe checkout on the pricing page</li>
        </ul>
        <p style="color: #6b7280; font-size: 14px;">
          — The MERN Starter Team
        </p>
      </body>
    </html>
  `;

  const text = `Welcome, ${name}! Thanks for signing up. Your MERN Starter account is ready.`;

  return { subject, html, text };
}
