# Acadexis Administration Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A premium, state-of-the-art administration dashboard built using **Next.js (App Router)** and **React 19**. The portal provides a comprehensive interface for staff and super-administrators to manage universities, faculties, departments, courses, user enrollment, study sessions, and resolve technical support issues for the Acadexis platform.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack & Libraries](#tech-stack--libraries)
3. [Architecture & Folder Structure](#architecture--folder-structure)
4. [Environment Variables](#environment-variables)
5. [Getting Started](#getting-started)
6. [API Architecture & Token Management](#api-architecture--token-management)
7. [Authentication & Route Security](#authentication--route-security)
8. [Available Scripts](#available-scripts)
9. [Documentation References](#documentation-references)

---

## Features

### 📊 Platform Metrics & Health
- **Live Stats Dashboard:** Real-time stats on total users, active study sessions, open support tickets, and course metrics.
- **Platform Health Monitoring:** Visualization of active sessions, system uptime, and unresolved issue counters.

### 👥 User Administration
- **Staff Promotion & Demotion:** Escalate standard users to administrative staff level.
- **Access Control:** Deactivate or activate accounts instantly.
- **Granular Filtering:** Filter users by their platform roles (`student`, `lecturer`, `admin`) and system status.

### 📚 Curriculum & Enrollment Management
- **Course Administration:** Full CRUD operations on catalog courses.
- **Material Hosting:** Upload, structure, and remove syllabus material attachments (PDFs, docs) directly on a per-course basis.
- **Bulk Enrollments:** Enroll multiple students to a course simultaneously.

### 🏫 Academic Hierarchy Builder
- **Institutions:** Manage universities registered under Acadexis.
- **Faculties & Departments:** Create, update, or remove departments and associate them with correct faculties and universities.

### 🛠️ Helpdesk & Escalations
- **Issue Reports Tracker:** Central hub for viewing and resolving user-reported issues.
- **Privilege Request Handling:** Verify, approve, or reject administrative level requests from staff.
- **Contact Messages:** Directly read incoming contact query lists.

---

## Tech Stack & Libraries

* **Core Framework:** [Next.js 16.2.7](https://nextjs.org/) (App Router) + [React 19.2.4](https://react.dev/)
* **Language:** [TypeScript 5](https://www.typescriptlang.org/)
* **Styling & Animation:**
  * [Tailwind CSS](https://tailwindcss.com/) for fluid, utility-first UI styling.
  * [Framer Motion](https://www.framer.com/motion/) for micro-interactions and smooth entry transitions.
  * [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) for declarative animation tokens.
* **State & Hook Management:**
  * [Zustand](https://github.com/pmndrs/zustand) for lightweight global client state management.
  * Custom React hooks for standardized CRUD api actions.
* **Form Validation:**
  * [React Hook Form](https://react-hook-form.com/) for form state management.
  * [Zod](https://zod.dev/) for client-side and API payload validation schemas.
* **Component Primitives:**
  * [Radix UI](https://www.radix-ui.com/) (Dialog, Dropdown Menu, Select, Slot, Label, Avatar) for fully accessible, unstyled interaction foundations.
  * [Lucide React](https://lucide.dev/) for clean, developer-friendly iconography.
  * [Sonner](https://sonner.dev/) for modern toast notifications.

---

## Architecture & Folder Structure

The directory setup is organized around modular components, custom hooks, and Next.js App Router rules:

```
acadexis_admin/
├── Docs/                              # Detailed system documentation
│   ├── ADMINISTRATION_API.md          # REST Endpoints reference
│   ├── ADMINISTRATOR_NEXTJS_HANDOVER.md # Developer handover guide
│   └── SETUP_ADMIN_API.md             # API server setup instructions
├── src/
│   ├── app/                           # App Router pages and layouts
│   │   ├── auth/                      # Login & logout flow pages
│   │   │   └── login/                 # Page component for user authentication
│   │   ├── dashboard/                 # Protected administration portal
│   │   │   ├── courses/               # Course catalog management views
│   │   │   ├── departments/           # Academic department configurations
│   │   │   ├── faculties/             # Academic faculty configurations
│   │   │   ├── support/               # Helpdesk, issue tracking & requests
│   │   │   ├── universities/          # University management screens
│   │   │   ├── users/                 # Member index, filtering & operations
│   │   │   ├── layout.tsx             # Persistent Dashboard Sidebar + Topbar layout
│   │   │   └── page.tsx               # Stats panel, health overview and action shortcuts
│   │   ├── layout.tsx                 # Core HTML setup & theme providers
│   │   └── globals.css                # Base custom styling & Tailwind configuration
│   ├── components/                    # Reusable React components
│   │   ├── dashboard/                 # Layout components (AdminSidebar, AdminTopBar)
│   │   ├── ui/                        # Primitives (Card, Button, Dialog, etc.)
│   │   └── ProtectedRoute.tsx         # Middleware wrapper verifying session validation
│   ├── hooks/                         # Custom Hooks wrapping REST endpoints
│   │   ├── useAuth.ts                 # Login, logout, status validation hook
│   │   ├── useAdminApi.ts             # Direct Axios wrapper with error helpers
│   │   ├── useAdminCourses.ts         # Course-specific state actions
│   │   ├── useAdminUsers.ts           # Account control interactions
│   │   └── useAdminUniversities.ts    # University administration logic
│   ├── lib/                           # Core utilities
│   │   └── api/
│   │       ├── client.ts              # Axios interceptors for Authorization token injects
│   │       └── config.ts              # Endpoint URL constants & general API settings
│   ├── services/                      # Shared API service definitions
│   │   ├── adminService.ts            # Central backend communication client
│   │   └── api-client.ts              # Custom client instantiation exporter
│   └── types/                         # Shared TypeScript interfaces & types
└── API_INTEGRATION.md                 # Migration notes & API architecture details
```

---

## Environment Variables

Configure environment variables in a `.env.local` file at the root of the project:

| Variable Name | Type | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | String | Base URL of the backend API for development. | `http://localhost:8000` |
| `NEXT_PUBLIC_API_BASE_URL_PROD` | String | Production API server host. | `https://api.acadexis.com` |
| `NEXT_PUBLIC_ADMIN_DASHBOARD_URL`| String | Local frontend domain for development. | `http://localhost:3001` |
| `NEXT_PUBLIC_ADMIN_DASHBOARD_URL_PROD`| String| Production domain for the admin panel. | `https://admin.acadexis.com` |
| `NEXT_PUBLIC_ENABLE_AUDIT_LOGS` | Boolean| Feature flag to display system audit logs. | `true` |
| `NEXT_PUBLIC_ENABLE_BULK_OPERATIONS`| Boolean| Feature flag to authorize bulk student imports. | `true` |

---

## Getting Started

### 📋 Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version `20.x` or later recommended) and `npm` installed.

### ⚙️ Step 1: Install Dependencies
Install all package dependencies via `npm`:
```bash
npm install
```

### 🔑 Step 2: Local Environment Setup
Create a `.env.local` file in your project root using the configuration below:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL_PROD=https://api.acadexis.com

NEXT_PUBLIC_ADMIN_DASHBOARD_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_DASHBOARD_URL_PROD=https://admin.acadexis.com

NEXT_PUBLIC_ENABLE_AUDIT_LOGS=true
NEXT_PUBLIC_ENABLE_BULK_OPERATIONS=true
```

### 🐍 Step 3: Set Up a Staff User on the Backend
To access the portal, you need a backend user with `is_staff` and/or `is_superuser` privileges:
```bash
# In your backend project directory
python manage.py createsuperuser
```

### 🚀 Step 4: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3001` (or whichever port Next.js binds to, usually `http://localhost:3000` or `http://localhost:3001`).

---

## API Architecture & Token Management

The API integration relies on a centralized Axios client inside [src/lib/api/client.ts](file:///c:/Users/Abiola%20John/Documents/OVERSIGHT/acadexis_admin/src/lib/api/client.ts):

* **Authorization Injection:** A request interceptor reads the stored `access_token` from `localStorage` and embeds it as a `Bearer` token inside the `Authorization` header on all outgoing requests.
* **Automated Token Refresh:** A response interceptor checks for `401 Unauthorized` responses. If encountered:
  1. It uses the `refresh_token` from `localStorage` to request a new access token from `/api/auth/refresh/`.
  2. If successful, it replaces the expired token in storage, updates the current request headers, and automatically replays the original failed request.
  3. If refresh fails (e.g. refresh token is also expired or invalid), the client clears the user storage and redirects the client to `/auth/login`.

---

## Authentication & Route Security

Pages located under `/dashboard` are protected using the `<ProtectedRoute>` component:

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function SensitiveArea() {
  return (
    <ProtectedRoute requiredRole="admin">
      <main>Admin-only Dashboard Content</main>
    </ProtectedRoute>
  );
}
```

* **Role Verification:** The route protection component matches the logged-in user's roles against the `requiredRole` prop:
  * `"staff"` level is required to see standard dashboard content. Non-staff users are blocked and redirected to login.
  * `"admin"` (requires `is_superuser: true` flag on the user profile) limits specific pages. If a non-superuser attempts to view a page requiring `requiredRole="admin"`, they are safely redirected back to the main `/dashboard` screen.

---

## Available Scripts

In the project root, you can run the following package commands:

* `npm run dev`: Runs the Next.js app in development mode with hot-reloading at [http://localhost:3000](http://localhost:3000).
* `npm run build`: Compiles the React/Next.js application and prepares it for production deployment.
* `npm run start`: Starts the Next.js production build server.
* `npm run lint`: Runs ESLint to check for configuration, typescript type-safety, and syntactic errors.

---

## Documentation References

For further details, refer to the following documentation files:
* **API Details:** Refer to [Docs/ADMINISTRATION_API.md](file:///c:/Users/Abiola%20John/Documents/OVERSIGHT/acadexis_admin/Docs/ADMINISTRATION_API.md) for endpoint details and JSON layouts.
* **Handover Guide:** Refer to [Docs/ADMINISTRATOR_NEXTJS_HANDOVER.md](file:///c:/Users/Abiola%20John/Documents/OVERSIGHT/acadexis_admin/Docs/ADMINISTRATOR_NEXTJS_HANDOVER.md) for code architectural patterns.
* **Setup Manual:** Refer to [Docs/SETUP_ADMIN_API.md](file:///c:/Users/Abiola%20John/Documents/OVERSIGHT/acadexis_admin/Docs/SETUP_ADMIN_API.md) for installing and running the database/backend dependencies.
* **Integration Notes:** Refer to [API_INTEGRATION.md](file:///c:/Users/Abiola%20John/Documents/OVERSIGHT/acadexis_admin/API_INTEGRATION.md) for custom hook setup examples.
