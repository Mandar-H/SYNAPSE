import React, { useState } from 'react';
import SummaryDisplay from './SummaryDisplay';
import api from '../utils/api';

const UploadForm = ({ theme, user }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setError(null);
    setResult(null);
    const f = e.target.files && e.target.files[0];
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError(null);
    setResult(null);

    if (!file) return setError('Please select a file to upload');

    try {
      setLoading(true);
      const resp = await api.processDocument(file, user?.email || null);
      setResult({ summary: resp.summary, filename: resp.filename || file.name, data: resp });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to process document');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <section style={{ maxWidth: 960, margin: '28px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 380px' }}>
          <h3 style={{ marginTop: 0, color: theme === 'dark' ? '#d4d4d4' : '#101217' }}>Upload a document</h3>
          <form onSubmit={handleSubmit}>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                border: '2px dashed',
                borderColor: theme === 'dark' ? '#3a3a3a' : '#e5e8ef',
                borderRadius: 12,
                padding: 18,
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme === 'dark' ? '#1b1b1b' : '#fff'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px', color: theme === 'dark' ? '#9aa0a6' : '#5f6673' }}>Drag & drop a file here, or</p>
                <input type="file" onChange={handleFileChange} style={{ cursor: 'pointer' }} />
                {file && <div style={{ marginTop: 8, color: theme === 'dark' ? '#d4d4d4' : '#101217' }}>{file.name} • {Math.round((file.size||0)/1024)} KB</div>}
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 16px',
                  background: '#007acc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Processing...' : 'Upload & Summarize'}
              </button>
              <button
                type="button"
                onClick={() => { setFile(null); setError(null); setResult(null); }}
                style={{
                  padding: '10px 12px',
                  background: theme === 'dark' ? '#2d2d2d' : '#f3f4f6',
                  color: theme === 'dark' ? '#d4d4d4' : '#101217',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>

            {error && <div style={{ marginTop: 12, color: '#ff6b6b' }}>{error}</div>}
          </form>
        </div>

        <div style={{ flex: '1 1 420px' }}>
          {loading && (
            <div style={{ padding: 20, borderRadius: 12, background: theme === 'dark' ? '#111' : '#f8fafc' }}>
              Processing document — this may take a few seconds.
            </div>
          )}

          {!loading && result && (
            <SummaryDisplay
              summary={result.summary}
              filename={result.filename}
              theme={theme}
              onClose={() => setResult(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadForm;
