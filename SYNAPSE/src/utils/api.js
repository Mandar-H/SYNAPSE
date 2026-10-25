/**
 * API utility functions for backend communication
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Check if backend is available
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Process a document file
 */
export const processDocument = async (file, userEmail = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (userEmail) {
    formData.append('user_email', userEmail);
  }
  formData.append('action', 'summarize');

  const response = await fetch(`${API_BASE_URL}/process_document`, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(120000) // 2 minute timeout
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      detail: `Server error: ${response.status} ${response.statusText}` 
    }));
    throw new Error(errorData.detail || 'Failed to process document');
  }

  return await response.json();
};

export default {
  API_BASE_URL,
  checkBackendHealth,
  processDocument
};

