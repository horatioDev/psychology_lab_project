import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { apiFetch } from '../lib/api.js';

export default function FileUpload() {
  const { getToken } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    setFile(selected || null);
    setResult(null);
    setError(null);

    if (selected?.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', file);

      const data = await apiFetch('/upload', {
        method: 'POST',
        token,
        body: formData,
      });

      setResult(data.file);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold">Cloudinary Upload</h3>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg
            file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-brand-600"
        />

        {preview && (
          <img src={preview} alt="Preview" className="h-32 rounded-lg object-cover" />
        )}

        <button type="submit" disabled={!file || uploading} className="btn-primary">
          {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm">
          <p className="font-medium text-green-800">Upload successful!</p>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 underline"
          >
            View file
          </a>
        </div>
      )}
    </div>
  );
}
