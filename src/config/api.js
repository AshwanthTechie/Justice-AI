// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7777',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:7777',
  ENDPOINTS: {
    USER: {
      ADD: '/user/add',
      LOGIN: '/user/login',
      LOGOUT: '/user/logout',
      GET: '/user/get',
      UPDATE: '/user/update',
      DELETE: '/user/delete'
    },
    CHAT: {
      CREATE: '/api/chat/create',
      LIST: '/api/chat/list',
      GET: '/api/chat',
      MESSAGES: '/api/chat',
      SEND_MESSAGE: '/api/chat/message',
      DELETE: '/api/chat',
      DELETE_ALL: '/api/chat/all',
      UPDATE_TITLE: '/api/chat'
    },
    CASES: {
      SEARCH: '/api/cases/search',
      GET_DETAILS: '/api/cases',
      CONTEXTUAL: '/api/cases/contextual',
      LOCAL: '/api/cases/local',
      SIMILAR: '/api/cases/similar'
    }
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
