import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/api/config';
import { useAdminApi, PaginatedResponse } from './useAdminApi';

export interface University {
  id: string;
  name: string;
  code: string;
  description: string;
  logo: string | null;
  website: string | null;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export const useAdminUniversities = () => {
  const { get, post, patch, delete_, loading, error } = useAdminApi();
  const [universities, setUniversities] = useState<University[]>([]);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

  const fetchUniversities = useCallback(
    async (filters: Record<string, any> = {}, page = 1) => {
      const params = { page, ...filters };
      const response = await get<PaginatedResponse<University>>(
        API_ENDPOINTS.ADMIN.UNIVERSITIES,
        params
      );

      if (response) {
        setUniversities(response.results);
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous,
        });
      }

      return response;
    },
    [get]
  );

  const createUniversity = useCallback(
    async (universityData: Partial<University>) => {
      const result = await post(API_ENDPOINTS.ADMIN.UNIVERSITIES, universityData);
      if (result) {
        setUniversities((prev) => [...prev, result as University]);
      }
      return result;
    },
    [post]
  );

  const updateUniversity = useCallback(
    async (universityId: string, updates: Partial<University>) => {
      const result = await patch(`${API_ENDPOINTS.ADMIN.UNIVERSITIES}${universityId}/`, updates);
      if (result) {
        setUniversities((prev) =>
          prev.map((u) => (u.id === universityId ? { ...u, ...result } : u))
        );
      }
      return result;
    },
    [patch]
  );

  const deleteUniversity = useCallback(
    async (universityId: string) => {
      const success = await delete_(`${API_ENDPOINTS.ADMIN.UNIVERSITIES}${universityId}/`);
      if (success) {
        setUniversities((prev) => prev.filter((u) => u.id !== universityId));
      }
      return success;
    },
    [delete_]
  );

  return {
    universities,
    loading,
    error,
    pagination,
    fetchUniversities,
    createUniversity,
    updateUniversity,
    deleteUniversity,
  };
};
