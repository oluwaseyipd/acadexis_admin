import { apiClient, setAuthToken, clearAuthToken } from './api-client';
import { API_ENDPOINTS } from '@/lib/api/config';
import type {
  AdminUser,
  AdminCourse,
  ContactMessage,
  IssueReport,
  AdminRequest,
  UserFilters,
  CourseFilters,
  CourseEnrollment,
  PaginatedAdminUsers,
  PaginatedAdminCourses,
  University,
  Faculty,
  Department,
} from '@/types';

const adminService = {
  // ── Authentication ──────────────────────────────────────────────────────────

  /**
   * Admin login with email and password
   */
  async login(payload: { email: string; password: string }): Promise<{
    access: string;
    refresh: string;
    user: { id: string; email: string; role: string; first_name: string; last_name: string; is_staff: boolean };
  }> {
    const response = await apiClient.post<{
      access: string;
      refresh: string;
      user: any;
    }>(API_ENDPOINTS.AUTH.LOGIN, {
      email: payload.email,
      password: payload.password,
    });

    const { access, refresh, user } = response.data;
    setAuthToken(access);
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('admin_user', JSON.stringify(user));
    }
    
    return { access, refresh, user };
  },

  /**
   * Admin logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    } finally {
      clearAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_user');
      }
    }
  },

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AdminUser | null> {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('admin_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // ── User Management ─────────────────────────────────────────────────────────

  async getUsers(params?: UserFilters): Promise<PaginatedAdminUsers> {
    const response = await apiClient.get<PaginatedAdminUsers>(API_ENDPOINTS.ADMIN.USERS, { params });
    return response.data;
  },

  async getUserById(userId: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(`${API_ENDPOINTS.ADMIN.USERS}${userId}/`);
    return response.data;
  },

  async updateUser(
    userId: string,
    data: { email?: string; role?: 'student' | 'lecturer' | 'admin'; is_active?: boolean }
  ): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`${API_ENDPOINTS.ADMIN.USERS}${userId}/`, data);
    return response.data;
  },

  async promoteToStaff(userId: string): Promise<AdminUser> {
    const response = await apiClient.post<AdminUser>(`${API_ENDPOINTS.ADMIN.USERS}${userId}/promote_to_staff/`, {});
    return response.data;
  },

  async activateUser(userId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(`${API_ENDPOINTS.ADMIN.USERS}${userId}/activate/`, {});
    return response.data;
  },

  async deactivateUser(userId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(`${API_ENDPOINTS.ADMIN.USERS}${userId}/deactivate/`, {});
    return response.data;
  },

  // ── Course Management ────────────────────────────────────────────────────────

  async getCourses(params?: CourseFilters): Promise<PaginatedAdminCourses> {
    const response = await apiClient.get<PaginatedAdminCourses>(API_ENDPOINTS.ADMIN.COURSES, { params });
    return response.data;
  },

  async getCourseDetails(courseId: string): Promise<AdminCourse> {
    const response = await apiClient.get<AdminCourse>(`${API_ENDPOINTS.ADMIN.COURSES}${courseId}/`);
    return response.data;
  },

  async updateCourse(
    courseId: string,
    data: {
      title?: string;
      code?: string;
      description?: string;
      department?: string | null;
      lecturer?: string | null;
      level?: string;
      lecturer_remark?: string;
    }
  ): Promise<AdminCourse> {
    const response = await apiClient.patch<AdminCourse>(`${API_ENDPOINTS.ADMIN.COURSES}${courseId}/`, data);
    return response.data;
  },

  async createCourse(data: {
    title: string;
    code: string;
    description?: string;
    department?: string | null;
    lecturer?: string | null;
    level: string;
    lecturer_remark?: string;
  }): Promise<AdminCourse> {
    const response = await apiClient.post<AdminCourse>(API_ENDPOINTS.ADMIN.COURSES, data);
    return response.data;
  },

  async deleteCourse(courseId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<void>(`${API_ENDPOINTS.ADMIN.COURSES}${courseId}/`);
    return { success: response.status === 204 };
  },

  async enrollStudent(courseId: string, studentId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `${API_ENDPOINTS.ADMIN.COURSES}${courseId}/enroll/`,
      { student: studentId }
    );
    return response.data;
  },

  async unenrollStudent(courseId: string, studentId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `${API_ENDPOINTS.ADMIN.COURSES}${courseId}/unenroll/`,
      { student: studentId }
    );
    return response.data;
  },

  async getCourseEnrollments(courseId: string): Promise<CourseEnrollment[]> {
    const response = await apiClient.get<CourseEnrollment[]>(`${API_ENDPOINTS.ADMIN.COURSES}${courseId}/enrollments/`);
    return response.data;
  },

  // ── University Management ────────────────────────────────────────────────────

  async getUniversities(params?: any): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.UNIVERSITIES, { params });
    return response.data;
  },

  async getUniversityById(universityId: string): Promise<University> {
    const response = await apiClient.get<University>(`${API_ENDPOINTS.ADMIN.UNIVERSITIES}${universityId}/`);
    return response.data;
  },

  async createUniversity(data: Partial<University>): Promise<University> {
    const response = await apiClient.post<University>(API_ENDPOINTS.ADMIN.UNIVERSITIES, data);
    return response.data;
  },

  async updateUniversity(universityId: string, data: Partial<University>): Promise<University> {
    const response = await apiClient.patch<University>(`${API_ENDPOINTS.ADMIN.UNIVERSITIES}${universityId}/`, data);
    return response.data;
  },

  async deleteUniversity(universityId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<void>(`${API_ENDPOINTS.ADMIN.UNIVERSITIES}${universityId}/`);
    return { success: response.status === 204 };
  },

  // ── Faculty Management ───────────────────────────────────────────────────────

  async getFaculties(params?: any): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.FACULTIES, { params });
    return response.data;
  },

  async getFacultyById(facultyId: string): Promise<Faculty> {
    const response = await apiClient.get<Faculty>(`${API_ENDPOINTS.ADMIN.FACULTIES}${facultyId}/`);
    return response.data;
  },

  async createFaculty(data: Partial<Faculty>): Promise<Faculty> {
    const response = await apiClient.post<Faculty>(API_ENDPOINTS.ADMIN.FACULTIES, data);
    return response.data;
  },

  async updateFaculty(facultyId: string, data: Partial<Faculty>): Promise<Faculty> {
    const response = await apiClient.patch<Faculty>(`${API_ENDPOINTS.ADMIN.FACULTIES}${facultyId}/`, data);
    return response.data;
  },

  async deleteFaculty(facultyId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<void>(`${API_ENDPOINTS.ADMIN.FACULTIES}${facultyId}/`);
    return { success: response.status === 204 };
  },

  // ── Department Management ────────────────────────────────────────────────────

  async getDepartments(params?: any): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.DEPARTMENTS, { params });
    return response.data;
  },

  async getDepartmentById(departmentId: string): Promise<Department> {
    const response = await apiClient.get<Department>(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}${departmentId}/`);
    return response.data;
  },

  async createDepartment(data: Partial<Department>): Promise<Department> {
    const response = await apiClient.post<Department>(API_ENDPOINTS.ADMIN.DEPARTMENTS, data);
    return response.data;
  },

  async updateDepartment(departmentId: string, data: Partial<Department>): Promise<Department> {
    const response = await apiClient.patch<Department>(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}${departmentId}/`, data);
    return response.data;
  },

  async deleteDepartment(departmentId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<void>(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}${departmentId}/`);
    return { success: response.status === 204 };
  },

  // ── Support / Contact Messages ─────────────────────────────────────────────

  async getContactMessages(): Promise<ContactMessage[]> {
    const response = await apiClient.get<ContactMessage[]>(`${API_ENDPOINTS.ADMIN.USERS}contacts/`);
    return response.data;
  },

  // ── Issue Reports ─────────────────────────────────────────────────────────

  async getIssueReports(params?: { resolved?: boolean }): Promise<IssueReport[]> {
    const response = await apiClient.get<IssueReport[]>(`${API_ENDPOINTS.ADMIN.USERS}reports/`, { params });
    return response.data;
  },

  async resolveIssueReport(reportId: string): Promise<IssueReport> {
    const response = await apiClient.patch<IssueReport>(`${API_ENDPOINTS.ADMIN.USERS}reports/${reportId}/resolve/`, {});
    return response.data;
  },

  // ── Admin Requests ─────────────────────────────────────────────────────────

  async getAdminRequests(params?: { status?: 'pending' | 'approved' | 'rejected' }): Promise<AdminRequest[]> {
    const response = await apiClient.get<AdminRequest[]>(`${API_ENDPOINTS.ADMIN.USERS}requests/`, { params });
    return response.data;
  },

  async approveAdminRequest(requestId: string): Promise<AdminRequest> {
    const response = await apiClient.patch<AdminRequest>(`${API_ENDPOINTS.ADMIN.USERS}requests/${requestId}/approve/`, {});
    return response.data;
  },

  async rejectAdminRequest(requestId: string): Promise<AdminRequest> {
    const response = await apiClient.patch<AdminRequest>(`${API_ENDPOINTS.ADMIN.USERS}requests/${requestId}/reject/`, {});
    return response.data;
  },

  // ── Course Enrollments ───────────────────────────────────────────────────────

  async getBulkEnrollments(params?: any): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ENROLLMENTS, { params });
    return response.data;
  },

  async createBulkEnrollment(data: { course: string; students: string[] }): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.ENROLLMENTS + 'bulk/', data);
    return response.data;
  },

  // ── Course Materials ─────────────────────────────────────────────────────────

  async getCourseMaterials(courseId?: string, params?: any): Promise<any> {
    let url = API_ENDPOINTS.ADMIN.MATERIALS;
    if (courseId) {
      url = `${API_ENDPOINTS.ADMIN.COURSES}${courseId}/materials/`;
    }
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  async uploadCourseMaterial(courseId: string, file: File, data?: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (data?.title) formData.append('title', data.title);
    if (data?.description) formData.append('description', data.description);

    const response = await apiClient.post(
      `${API_ENDPOINTS.ADMIN.COURSES}${courseId}/materials/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  async deleteCourseMaterial(materialId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<void>(`${API_ENDPOINTS.ADMIN.MATERIALS}${materialId}/`);
    return { success: response.status === 204 };
  },

  // ── Ratings & Study Sessions ──────────────────────────────────────────────────

  async getRatings(params?: any): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.RATINGS, { params });
    return response.data;
  },

  async getStudySessions(params?: any): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.STUDY_SESSIONS, { params });
    return response.data;
  },
};

export default adminService;