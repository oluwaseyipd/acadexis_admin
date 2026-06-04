/**
 * API Client - Centralized API client for Acadexis Admin
 * 
 * This module re-exports the centralized apiClient from lib/api/client.ts
 * It maintains backward compatibility with existing code that imports from here.
 */

export { apiClient } from '@/lib/api/client';
export { setAuthToken, clearAuthToken } from '@/lib/api/client';
export { API_CONFIG, API_ENDPOINTS } from '@/lib/api/config';

// For backward compatibility, also export tokenStorage functions
export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },
  setTokens: (access: string, refresh: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },
  clearAll: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('admin_user');
  },
};

// Re-export for backward compatibility
import { apiClient } from '@/lib/api/client';
export const authClient = apiClient;
export const adminApiClient = apiClient;