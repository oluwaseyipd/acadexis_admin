import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: any;
}

export const useAdminApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const get = useCallback(
    async <T = any>(url: string, params: any = {}): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await apiClient.get<T>(url, { params });
        return data;
      } catch (err: any) {
        const errorData = err.response?.data || { detail: err.message };
        setError(errorData);
        console.error('API GET error:', errorData);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const post = useCallback(
    async <T = any>(url: string, payload: any = {}): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await apiClient.post<T>(url, payload);
        return data;
      } catch (err: any) {
        const errorData = err.response?.data || { detail: err.message };
        setError(errorData);
        console.error('API POST error:', errorData);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const patch = useCallback(
    async <T = any>(url: string, payload: any = {}): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await apiClient.patch<T>(url, payload);
        return data;
      } catch (err: any) {
        const errorData = err.response?.data || { detail: err.message };
        setError(errorData);
        console.error('API PATCH error:', errorData);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const delete_ = useCallback(
    async (url: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.delete(url);
        return true;
      } catch (err: any) {
        const errorData = err.response?.data || { detail: err.message };
        setError(errorData);
        console.error('API DELETE error:', errorData);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { get, post, patch, delete_, loading, error };
};
