import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/api/config';
import { useAdminApi, PaginatedResponse } from './useAdminApi';

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  department: string;
  department_name: string;
  lecturer: string;
  lecturer_email: string;
  level: string;
  thumbnail: string | null;
  enrollment_count: number;
  material_count: number;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  count: number;
  next: string | null;
  previous: string | null;
}

export const useAdminCourses = () => {
  const { get, post, patch, delete_, loading, error } = useAdminApi();
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    count: 0,
    next: null,
    previous: null,
  });

  const fetchCourses = useCallback(
    async (filters: Record<string, any> = {}, page = 1) => {
      const params = { page, ...filters };
      const response = await get<PaginatedResponse<Course>>(
        API_ENDPOINTS.ADMIN.COURSES,
        params
      );

      if (response) {
        setCourses(response.results);
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

  const createCourse = useCallback(
    async (courseData: Partial<Course>) => {
      const result = await post(API_ENDPOINTS.ADMIN.COURSES, courseData);
      if (result) {
        setCourses((prev) => [...prev, result as Course]);
      }
      return result;
    },
    [post]
  );

  const updateCourse = useCallback(
    async (courseId: string, updates: Partial<Course>) => {
      const result = await patch(`${API_ENDPOINTS.ADMIN.COURSES}${courseId}/`, updates);
      if (result) {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, ...result } : c))
        );
      }
      return result;
    },
    [patch]
  );

  const deleteCourse = useCallback(
    async (courseId: string) => {
      const success = await delete_(`${API_ENDPOINTS.ADMIN.COURSES}${courseId}/`);
      if (success) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      }
      return success;
    },
    [delete_]
  );

  return {
    courses,
    loading,
    error,
    pagination,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};
