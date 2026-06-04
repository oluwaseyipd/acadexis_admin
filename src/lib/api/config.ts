const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    LOGOUT: '/api/auth/logout/',
    REFRESH: '/api/auth/refresh/',
  },
  ADMIN: {
    USERS: '/api/admin/users/',
    UNIVERSITIES: '/api/admin/universities/',
    FACULTIES: '/api/admin/faculties/',
    DEPARTMENTS: '/api/admin/departments/',
    COURSES: '/api/admin/courses/',
    ENROLLMENTS: '/api/admin/enrollments/',
    MATERIALS: '/api/admin/materials/',
    RATINGS: '/api/admin/ratings/',
    STUDY_SESSIONS: '/api/admin/study-sessions/',
  },
};
