export const DOCUMENT_STATUS = {
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  EMBEDDING: 'EMBEDDING',
  READY: 'READY',
  FAILED: 'FAILED',
  DELETING: 'DELETING',
  DELETED: 'DELETED'
};

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
};

export const STREAM_EVENTS = {
  START: 'message:start',
  TOKEN: 'message:token',
  CITATION: 'citation',
  COMPLETE: 'message:complete',
  ERROR: 'message:error'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    ME: '/api/v1/auth/me',
    LOGOUT: '/api/v1/auth/logout'
  },
  DOCUMENTS: {
    BASE: '/api/v1/documents',
    STATUS: (id) => `/api/v1/documents/${id}/status`,
    RETRY: (id) => `/api/v1/documents/${id}/retry`
  },
  CHAT: {
    STREAM: '/api/v1/chat/stream',
    DIRECT: '/api/v1/chat'
  },
  CONVERSATIONS: {
    BASE: '/api/v1/conversations'
  },
  HEALTH: '/api/v1/health'
};
