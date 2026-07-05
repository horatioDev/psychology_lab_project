import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { apiFetch } from '../lib/api.js';

const PLANS = [
  {
    id: 'subscription',
    name: 'Pro Monthly',
    price: '$9',
    period: '/month',
    description: 'Full access with recurring billing',
    mode: 'subscription',
    features: ['Unlimited uploads', 'Priority support', 'Analytics dashboard'],
  },
  {
    id: 'onetime',
    name: 'Lifetime',
    price: '$49',
    period: ' once',
    description: 'One-time payment, lifetime access',
    mode: 'payment',
    features: ['All Pro features', 'No recurring fees', 'Early access to new features'],
  },
];

export default function PricingPage() {
  const { getToken, isSignedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (searchParams.get('success')) {
      setMessage({ type: 'success', text: 'Payment successful! Thank you.' });
    } else if (searchParams.get('canceled')) {
      setMessage({ type: 'info', text: 'Checkout was canceled.' });
    }
  }, [searchParams]);

  async function handleCheckout(mode) {
    if (!isSignedIn) {
      setMessage({ type: 'error', text: 'Please sign in to continue to checkout.' });
      return;
    }

    setLoading(mode);
    setMessage(null);

    try {
      const token = await getToken();
      const data = await apiFetch('/stripe/create-checkout-session', {
        method: 'POST',
        token,
        body: JSON.stringify({ mode }),
      });

      window.location.href = data.url;
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">Simple Pricing</h1>
        <p className="mt-2 text-gray-600">Choose a plan powered by Stripe</p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg p-4 text-center text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : message.type === 'error'
                ? 'bg-red-50 text-red-800'
                : 'bg-blue-50 text-blue-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <div key={plan.id} className="card flex flex-col">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
            <p className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-gray-500">{plan.period}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-gray-600">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan.mode)}
              disabled={loading === plan.mode}
              className="btn-primary mt-6 w-full"
            >
              {loading === plan.mode ? 'Redirecting...' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
