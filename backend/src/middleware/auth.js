import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';

/**
 * Clerk free tier: 10,000 MAU - attach session to every request.
 */
export const clerkAuth = clerkMiddleware();

/** Protect routes - returns 401 if no valid Clerk session. */
export const protect = requireAuth();

/** Optional auth - attaches userId when present, does not block. */
export function optionalAuth(req, res, next) {
  const { userId } = getAuth(req);
  req.userId = userId || null;
  next();
}

export { getAuth };
