import { useUser } from '@clerk/clerk-react';
import FileUpload from '../components/FileUpload.jsx';
import SentryTestButton from '../components/SentryTestButton.jsx';
import { apiFetch } from '../lib/api.js';
import { useState } from 'react';

export default function Dashboard() {
  const { user } = useUser();
  const [apiHealth, setApiHealth] = useState(null);

  async function checkHealth() {
    const data = await apiFetch('/users/health');
    setApiHealth(data);
  }

  async function testBackendSentry() {
    try {
      await apiFetch('/sentry-capture');
      alert('Backend Sentry message sent');
    } catch {
      alert('Backend Sentry test failed - check server logs');
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
      <p className="mb-8 text-gray-600">
        Welcome, {user?.fullName || user?.firstName || 'User'}!
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <FileUpload />
        <SentryTestButton />

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold">API Health Check</h3>
          <button onClick={checkHealth} className="btn-secondary">
            Ping Backend
          </button>
          {apiHealth && (
            <pre className="mt-3 overflow-auto rounded bg-gray-50 p-3 text-xs">
              {JSON.stringify(apiHealth, null, 2)}
            </pre>
          )}
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold">Backend Sentry Test</h3>
          <button onClick={testBackendSentry} className="btn-secondary">
            Send Backend Test Message
          </button>
        </div>
      </div>
    </div>
  );
}
