import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/api/config';
import { useAdminApi, PaginatedResponse } from './useAdminApi';

export interface Pagination {
  count: number;
  next: string | null;
  previous: string | null;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'lecturer' | 'admin';
  is_active: boolean;
  is_staff: boolean;
  university: string;
  university_name: string;
  date_joined: string;
}

export const useAdminUsers = () => {
  const { get, post, patch, delete_, loading, error } = useAdminApi();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ count: 0, next: null, previous: null });

  const fetchUsers = useCallback(
    async (filters: Record<string, any> = {}, page = 1) => {
      const params = { page, ...filters };
      const response = await get<PaginatedResponse<User>>(
        API_ENDPOINTS.ADMIN.USERS,
        params
      );

      if (response) {
        setUsers(response.results);
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

  const createUser = useCallback(
    async (userData: Partial<User>) => {
      const result = await post(API_ENDPOINTS.ADMIN.USERS, userData);
      if (result) {
        setUsers((prev) => [...prev, result as User]);
      }
      return result;
    },
    [post]
  );

  const updateUser = useCallback(
    async (userId: string, updates: Partial<User>) => {
      const result = await patch(`${API_ENDPOINTS.ADMIN.USERS}${userId}/`, updates);
      if (result) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, ...result } : u))
        );
      }
      return result;
    },
    [patch]
  );

  const deactivateUser = useCallback(
    async (userId: string) => {
      const result = await post(`${API_ENDPOINTS.ADMIN.USERS}${userId}/deactivate/`, {});
      if (result) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_active: false } : u))
        );
      }
      return result;
    },
    [post]
  );

  const activateUser = useCallback(
    async (userId: string) => {
      const result = await post(`${API_ENDPOINTS.ADMIN.USERS}${userId}/activate/`, {});
      if (result) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_active: true } : u))
        );
      }
      return result;
    },
    [post]
  );

  const promoteToStaff = useCallback(
    async (userId: string) => {
      const result = await post(`${API_ENDPOINTS.ADMIN.USERS}${userId}/promote_to_staff/`, {});
      if (result) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_staff: true } : u))
        );
      }
      return result;
    },
    [post]
  );

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deactivateUser,
    activateUser,
    promoteToStaff,
  };
};
