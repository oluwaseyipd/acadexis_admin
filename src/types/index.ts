// Admin Types

// User Types
export interface AdminUser {
  id: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  name?: string;
  university: string | null;
  university_name: string | null;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  profile?: AdminUserProfile;
}

export interface AdminUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  identification_number: string;
  level: string;
  department: string | null;
  department_name: string | null;
  avatar: string | null;
}

// Course Types
export interface AdminCourse {
  id: string;
  title: string;
  code: string;
  description: string;
  department: string | null;
  department_name?: string;
  lecturer: string | null;
  lecturer_name?: string;
  thumbnail: string | null;
  level: string;
  lecturer_remark: string;
  materials_count: number;
  students_enrolled: number;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: string;
  student: AdminUser;
  course: AdminCourse;
  created_at: string;
}

// Support Types
export interface ContactMessage {
  id: string;
  user: string | null;
  userName?: string;
  subject: string;
  body: string;
  email: string;
  created_at: string;
}

export interface IssueReport {
  id: string;
  user: string | null;
  userName?: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  resolved: boolean;
  created_at: string;
}

export interface AdminRequest {
  id: string;
  user: string;
  userName?: string;
  userEmail?: string;
  reason: string;
  document_proof: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

// Statistics Types
export interface AdminStatistics {
  totalUsers: number;
  totalStudents: number;
  totalLecturers: number;
  totalAdmins: number;
  totalCourses: number;
  totalEnrollments: number;
  activeSessions: number;
  unresolvedReports: number;
  pendingAdminRequests: number;
}

export interface AnalyticsOverview {
  topCourses: AdminCourse[];
  recentEnrollments: CourseEnrollment[];
  activityByDay: { date: string; count: number }[];
}

// Pagination
export interface PaginatedAdminUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUser[];
}

export interface PaginatedAdminCourses {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminCourse[];
}

// Filters
export interface UserFilters {
  role?: "student" | "lecturer" | "admin";
  university?: string;
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface CourseFilters {
  department?: string;
  lecturer?: string;
  level?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

// Institution Types
export interface University {
  id: string;
  name: string;
  code: string;
  description: string;
  created_at?: string;
}

export interface Faculty {
  id: string;
  name: string;
  university: string;
  university_name?: string;
  created_at?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  faculty: string;
  faculty_name?: string;
  created_at?: string;
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
  profile?: {
    first_name: string;
    last_name: string;
    avatar?: string;
  };
}

export type UserRole = "student" | "lecturer" | "admin";