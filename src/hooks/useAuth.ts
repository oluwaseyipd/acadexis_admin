import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, setAuthToken, clearAuthToken } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  role: string;
  is_staff: boolean;
  first_name: string;
  last_name: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
      }
      setAuthToken(data.access);

      // Store user
      setUser(data.user);

      // Verify staff status
      if (!data.user.is_staff) {
        throw new Error('You do not have admin access.');
      }

      // Redirect to admin dashboard
      await router.push('/dashboard');

      return { success: true };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Login failed. Please check your credentials.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    } catch (err) {
      // Logout endpoint might fail, but we still clear local auth
      console.error('Logout API error:', err);
    } finally {
      clearAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_user');
      }
      setUser(null);
      setLoading(false);
      await router.push('/auth/login');
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.ADMIN.USERS + 'me/');
      setUser(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_user', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  return { user, loading, error, login, logout, refreshUser };
};
