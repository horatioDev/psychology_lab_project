import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const features = [
  { title: 'Clerk Auth', desc: 'Email/password + OAuth, 10K MAU free' },
  { title: 'Cloudinary', desc: 'Image & file uploads, 25 credits/month' },
  { title: 'Resend', desc: 'Transactional emails, 3K/month free' },
  { title: 'PostHog', desc: 'Analytics & events, 1M events/month' },
  { title: 'Sentry', desc: 'Error tracking, 5K errors/month' },
  { title: 'Stripe', desc: 'Subscriptions & one-time payments' },
];

export default function Home() {
  return (
    <div>
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Production-Ready{' '}
          <span className="text-brand-600">Psychology Lab</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          MongoDB, Express, React, and Node.js with Clerk, Cloudinary, Resend,
          PostHog, Sentry, and Stripe - all on free tiers.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <SignedOut>
            <Link to="/sign-in" className="btn-primary px-6 py-3 text-base">
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="btn-primary px-6 py-3 text-base">
              Go to Dashboard
            </Link>
          </SignedIn>
          <Link to="/pricing" className="btn-secondary px-6 py-3 text-base">
            View Pricing
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="card">
            <h3 className="font-semibold text-brand-600">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
