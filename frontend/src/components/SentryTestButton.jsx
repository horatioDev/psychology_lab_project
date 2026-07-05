import { Sentry } from '../config/sentry.js';

export default function SentryTestButton() {
  function triggerError() {
    throw new Error('Sentry frontend test error - this is intentional');
  }

  function captureMessage() {
    Sentry.captureMessage('Sentry frontend test message', 'info');
    alert('Test message sent to Sentry');
  }

  return (
    <div className="card">
      <h3 className="mb-2 text-lg font-semibold">Sentry Error Tracking</h3>
      <p className="mb-4 text-sm text-gray-500">
        Test error monitoring on the frontend (free tier: 5K errors/month).
      </p>
      <div className="flex gap-3">
        <button onClick={triggerError} className="btn-secondary text-red-600">
          Trigger Error
        </button>
        <button onClick={captureMessage} className="btn-secondary">
          Send Test Message
        </button>
      </div>
    </div>
  );
}
