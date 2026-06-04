# API Integration Implementation Guide

## Overview

This admin dashboard has been reformed to fully utilize the Acadexis Administration API as documented in [ADMINISTRATOR_NEXTJS_HANDOVER.md](ADMINISTRATOR_NEXTJS_HANDOVER.md).

## New Architecture

### 1. **Centralized API Client** (`src/lib/api/`)

#### Configuration (`config.ts`)
- Defines `API_CONFIG` with base URL, timeout, retry settings
- Defines `API_ENDPOINTS` mapping for all admin resources
- Automatically uses production URLs in production builds

#### Client (`client.ts`)
- Axios instance with automatic JWT token management
- Request interceptor adds Bearer token to all requests
- Response interceptor handles 401 errors and token refresh
- Exports `setAuthToken()` and `clearAuthToken()` utilities

### 2. **Authentication** (`src/hooks/useAuth.ts`)

**Usage:**
```typescript
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, loading, error, login, logout, refreshUser } = useAuth();
  
  // Login
  const result = await login({ email: 'admin@example.com', password: 'password' });
  
  // Logout
  await logout();
}
```

**Features:**
- Handles login/logout flow
- Manages access and refresh tokens
- Verifies staff status (only staff users can access admin)
- Auto-redirects to login on 401
- Stores user data in localStorage

### 3. **Generic API Hook** (`src/hooks/useAdminApi.ts`)

**Usage:**
```typescript
import { useAdminApi } from '@/hooks/useAdminApi';

export default function MyComponent() {
  const { get, post, patch, delete_, loading, error } = useAdminApi();
  
  // GET request
  const data = await get<User[]>('/api/admin/users/', { page: 1 });
  
  // POST request
  const created = await post('/api/admin/users/', { email: 'new@example.com' });
  
  // PATCH request
  const updated = await patch('/api/admin/users/123/', { email: 'updated@example.com' });
  
  // DELETE request
  const success = await delete_('/api/admin/users/123/');
}
```

### 4. **Specialized Hooks** (`src/hooks/useAdmin*.ts`)

Ready-to-use hooks for common resources:

#### `useAdminUsers`
```typescript
const { users, fetchUsers, createUser, updateUser, deactivateUser, activateUser, promoteToStaff } = useAdminUsers();

await fetchUsers({ role: 'lecturer', is_active: true }, page);
await createUser({ email: 'lecturer@example.com', first_name: 'John' });
await promoteToStaff(userId);
```

#### `useAdminCourses`
```typescript
const { courses, fetchCourses, createCourse, updateCourse, deleteCourse } = useAdminCourses();

await fetchCourses({ department: 'deptId' }, page);
await createCourse({ title: 'Programming 101', code: 'CS101' });
```

#### `useAdminUniversities`
```typescript
const { universities, fetchUniversities, createUniversity, updateUniversity, deleteUniversity } = useAdminUniversities();

await fetchUniversities({}, page);
```

### 5. **Protected Routes** (`src/components/ProtectedRoute.tsx`)

**Usage:**
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="staff">
      <div>Admin Content</div>
    </ProtectedRoute>
  );
}
```

### 6. **Admin Service** (`src/services/adminService.ts`)

Backward-compatible service layer that uses the new API:

```typescript
import adminService from '@/services/adminService';

// Authentication
await adminService.login({ email: 'admin@example.com', password: 'password' });
await adminService.logout();

// Users
const users = await adminService.getUsers({ role: 'student' });
const user = await adminService.getUserById(userId);
await adminService.updateUser(userId, { email: 'new@example.com' });
await adminService.promoteToStaff(userId);

// Courses
const courses = await adminService.getCourses({ department: 'deptId' });
await adminService.createCourse({ title: 'Course Title', code: 'CS101' });
await adminService.deleteCourse(courseId);

// Hierarchies
const universities = await adminService.getUniversities();
const faculties = await adminService.getFaculties();
const departments = await adminService.getDepartments();
```

## Environment Setup

### `.env.local`

```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL_PROD=https://api.acadexis.com

# Admin Dashboard
NEXT_PUBLIC_ADMIN_DASHBOARD_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_DASHBOARD_URL_PROD=https://admin.acadexis.com

# Feature Flags
NEXT_PUBLIC_ENABLE_AUDIT_LOGS=true
NEXT_PUBLIC_ENABLE_BULK_OPERATIONS=true
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install axios zustand react-query react-toastify react-hook-form
```

### 2. Update `.env.local`

Set the `NEXT_PUBLIC_API_BASE_URL` to point to your backend API.

### 3. Create Staff User on Backend

```bash
python manage.py createsuperuser
# Email: admin@example.com
# Password: yourpassword
```

### 4. Start Development Server

```bash
npm run dev
# Navigate to http://localhost:3001/auth/login
```

## Migration Guide

### Before (Old Code)
```typescript
import adminService from '@/services/adminService';

const response = await adminService.login({
  username: 'admin',
  password: 'password'
});
```

### After (New Code)
```typescript
import { useAuth } from '@/hooks/useAuth';

const { login } = useAuth();

const result = await login({
  email: 'admin@example.com',
  password: 'password'
});
```

## Token Management

### Automatic Token Refresh
- Access tokens expire after 60 minutes
- When a 401 response is received, the client automatically refreshes the token
- If refresh fails, user is redirected to login

### Manual Token Management
```typescript
import { setAuthToken, clearAuthToken } from '@/lib/api/client';

// After login
setAuthToken(accessToken);

// On logout
clearAuthToken();
```

### Token Storage
- **Access Token**: `localStorage.access_token`
- **Refresh Token**: `localStorage.refresh_token`
- **User Data**: `localStorage.admin_user`

## Error Handling

### API Hook Errors
```typescript
const { get, error, loading } = useAdminApi();

const data = await get('/api/admin/users/');

if (error) {
  console.error('API Error:', error.detail);
  // Handle error
}
```

### Toast Notifications
```typescript
import { toast } from 'sonner';

try {
  await updateUser(userId, updates);
  toast.success('User updated successfully');
} catch (err) {
  toast.error('Failed to update user');
}
```

## API Endpoints Reference

See [ADMINISTRATION_API.md](ADMINISTRATION_API.md) for complete endpoint documentation.

### Common Endpoints
- Users: `/api/admin/users/`
- Universities: `/api/admin/universities/`
- Faculties: `/api/admin/faculties/`
- Departments: `/api/admin/departments/`
- Courses: `/api/admin/courses/`
- Enrollments: `/api/admin/enrollments/`
- Materials: `/api/admin/materials/`

## File Structure

```
src/
├── lib/
│   └── api/
│       ├── config.ts          # API configuration & endpoints
│       └── client.ts          # Axios client with JWT interceptors
├── hooks/
│   ├── useAuth.ts             # Authentication hook
│   ├── useAdminApi.ts         # Generic API hook
│   ├── useAdminUsers.ts       # Users management hook
│   ├── useAdminCourses.ts     # Courses management hook
│   └── useAdminUniversities.ts # Universities management hook
├── components/
│   └── ProtectedRoute.tsx     # Route protection wrapper
├── services/
│   ├── adminService.ts        # Service layer (backward-compatible)
│   └── api-client.ts          # Client re-exports
└── app/
    ├── auth/
    │   └── login/
    │       └── page.tsx       # Updated login page
    └── dashboard/
        └── page.tsx           # Dashboard pages
```

## Testing

### Login Flow
1. Navigate to `/auth/login`
2. Enter staff user credentials
3. Should redirect to `/dashboard`

### API Calls
```typescript
import adminService from '@/services/adminService';

// Fetch users
const { results, count } = await adminService.getUsers();
console.log(`Found ${count} users`);

// Create user
const newUser = await adminService.createUser({
  email: 'student@example.com',
  first_name: 'John',
  last_name: 'Doe',
  role: 'student'
});
```

## Troubleshooting

### 401 Unauthorized Errors
- Check if access token is valid: `localStorage.getItem('access_token')`
- Verify staff status: `localStorage.getItem('admin_user')`
- Clear tokens and login again

### CORS Issues
- Backend should have `CORS_ALLOWED_ORIGINS` set to include admin URL
- Check backend CORS configuration in Django settings

### Token Refresh Failures
- Verify refresh token is stored: `localStorage.getItem('refresh_token')`
- Check backend token expiry settings
- Clear both tokens and login again

## Next Steps

1. Update all dashboard pages to use the new hooks
2. Add more specialized hooks as needed (e.g., `useAdminEnrollments`, `useAdminMaterials`)
3. Implement pagination UI using `pagination` object from hooks
4. Add proper error handling and toast notifications
5. Consider using state management (Zustand) for global app state

## References

- [Admin API Documentation](ADMINISTRATION_API.md)
- [Next.js Handover Guide](ADMINISTRATOR_NEXTJS_HANDOVER.md)
- [Setup Guide](SETUP_ADMIN_API.md)
