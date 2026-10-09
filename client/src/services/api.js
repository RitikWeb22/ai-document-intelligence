export const API_BASE = import.meta.env.VITE_API_BASE || 'https://ai-document-intelligence-lwxo.onrender.com/api/v1';

export class ApiError extends Error {
  constructor(message, code = 'API_ERROR', status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('documind_token');

  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(
        data?.error?.message || res.statusText || 'Request failed',
        data?.error?.code || 'ERROR',
        res.status
      );
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || 'Network request failed', 'NETWORK_ERROR');
  }
}
