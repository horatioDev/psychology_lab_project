import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { trackEvent } from '../hooks/usePostHog.js';
import { apiFetch } from '../lib/api.js';

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn, getToken, user } = useAuth();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    async function syncUser() {
      try {
        const token = await getToken();
        const result = await apiFetch('/users/sync', {
          method: 'POST',
          token,
          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName || user.firstName,
            avatarUrl: user.imageUrl,
          }),
        });

        if (result.isNew) {
          trackEvent('user_login', {
            method: 'clerk',
            is_new_user: true,
          });
        }
      } catch (err) {
        console.error('User sync failed:', err.message);
      }
    }

    syncUser();
  }, [isSignedIn, user, getToken]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}
