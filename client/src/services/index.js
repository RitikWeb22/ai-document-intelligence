import { request, API_BASE } from './api.js';

export const authApi = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  getProfile: () => request('/auth/me')
};

export const documentsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/documents${query ? `?${query}` : ''}`);
  },

  upload: (formData) => request('/documents', {
    method: 'POST',
    body: formData
  }),

  getStatus: (id) => request(`/documents/${id}/status`),

  retry: (id) => request(`/documents/${id}/retry`, {
    method: 'POST'
  }),

  toggleFavorite: (id) => request(`/documents/${id}/favorite`, {
    method: 'PATCH'
  }),

  delete: (id) => request(`/documents/${id}`, {
    method: 'DELETE'
  })
};

export const conversationsApi = {
  list: () => request('/conversations'),
  create: (data) => request('/conversations', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getById: (id) => request(`/conversations/${id}`),
  delete: (id) => request(`/conversations/${id}`, {
    method: 'DELETE'
  })
};

export const chatApi = {
  async streamChat({ question, conversationId, documentIds, onToken, onCitation, onComplete, onError, signal }) {
    const token = localStorage.getItem('documind_token');

    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ question, conversationId, documentIds }),
        signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || 'Failed to connect to streaming server');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          let event = 'message';
          let data = null;

          const fieldLines = line.split('\n');
          for (const f of fieldLines) {
            if (f.startsWith('event: ')) {
              event = f.replace('event: ', '').trim();
            } else if (f.startsWith('data: ')) {
              try {
                data = JSON.parse(f.replace('data: ', '').trim());
              } catch (e) {
                data = f.replace('data: ', '').trim();
              }
            }
          }

          if (event === 'message:token' && data?.text) {
            onToken?.(data.text);
          } else if (event === 'citation' && data?.citations) {
            onCitation?.(data.citations);
          } else if (event === 'message:complete') {
            onComplete?.(data);
          } else if (event === 'message:error') {
            onError?.(data?.message || 'Generation error');
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Chat generation aborted by user');
      } else {
        onError?.(err.message);
      }
    }
  }
};
