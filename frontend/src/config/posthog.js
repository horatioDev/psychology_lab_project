import posthog from 'posthog-js';

/**
 * PostHog free tier: 1M events/month, 5K session recordings/month.
 */
export function initPostHog() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!key) {
    console.warn('VITE_POSTHOG_KEY not set — analytics disabled');
    return null;
  }

  posthog.init(key, {
    api_host: host,
    person_profiles: 'identified_only',
    capture_pageview: false,
  });

  return posthog;
}

export { posthog };
