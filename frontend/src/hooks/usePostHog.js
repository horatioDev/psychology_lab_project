import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '../config/posthog.js';

/** Tracks page views on every route change. */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;

    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path: location.pathname,
    });
  }, [location.pathname]);
}

/** Track custom events — e.g. user_login on sign-in. */
export function trackEvent(eventName, properties = {}) {
  if (!import.meta.env.VITE_POSTHOG_KEY) return;
  posthog.capture(eventName, properties);
}
