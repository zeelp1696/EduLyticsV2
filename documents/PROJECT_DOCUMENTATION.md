# Edulytics - Complete Project Documentation

## 📋 Project Overview

**Edulytics** is a comprehensive educational management platform built with React, TypeScript, and Tailwind CSS. It serves dual purposes:
1. **Institution Mode** - For schools/universities to manage master timetables, teacher tasks, and verification workflows
2. **Personal Mode** - For individual learners to manage their study schedules with AI-powered assistance

The application features a modern glass-morphism UI with dark mode support, role-based access control, and Supabase integration for backend services.

---

## 🏗️ Architecture Overview

```
Edulytics (Frontend - React + TypeScript + Vite)
│
├── Pages (Feature Containers)
├── Components (Reusable UI Elements)
├── Context (State Management)
├── Routes (Navigation & Protection)
├── Hooks (Custom React Hooks)
├── Integrations (Backend Services)
└── Utils & Styles
```

---

## 📁 File Structure & Logic Organization

### 1. **Entry Points**

#### `src/main.tsx`
- **Purpose**: Application bootstrapping
- **Logic**: Renders React app into DOM with root element
- **Dependencies**: React, ReactDOM

#### `src/App.tsx`
- **Purpose**: Root component and routing setup
- **Key Logic**:
  - Sets up React Router with BrowserRouter
  - Configures React Query for server state management
  - Wraps app with providers: QueryClientProvider, TooltipProvider, AuthProvider
  - Defines all routes (public and protected)
  - Routes are protected using ProtectedRoute wrapper
- **Routes Defined**:
  - Public: `/` (Landing), `/institution/login`, `/personal/login`, `/personal/signup`
  - Protected: `/dashboard`, `/calendar`, `/tasks`, `/timetable`, `/reports`, `/profile`, `/settings`

---

### 2. **Authentication & Authorization**

#### `src/authConfig.ts`
- **Purpose**: Configuration for demo users and authentication types
- **Key Exports**:
  - `UserMode`: 'institution' | 'personal'
  - `UserRole`: 'student' | 'teacher' | 'admin'
  - `DemoUser`: Interface defining user structure (email, password, mode, role)
  - `DEMO_USERS`: Array of demo credentials
    - Student (Institution): `student.xyz@academy.edu` / `DemoStudent123!`
    - Teacher (Institution): `teacher.xyz@academy.edu` / `DemoTeacher123!`
    - Learner (Personal): `demo.personal@edulytics.app` / `DemoPersonal123!`

#### `src/context/AuthContext.tsx`
- **Purpose**: Global authentication state management
- **Key Logic**:
  - `useAuth()` hook: Provides user data and authentication methods
  - `login()`: Validates credentials against DEMO_USERS, stores to localStorage
  - `logout()`: Clears user session
  - `AuthProvider`: Wraps app to provide auth context
- **State Managed**:
  - `user`: Current logged-in user data
  - `mode`: Institution or Personal
  - `role`: Student, Teacher, or Admin
- **Persistence**: Uses localStorage with key `edulytics_auth`

#### `src/routes/ProtectedRoute.tsx`
- **Purpose**: Route guard for authenticated pages
- **Logic**: 
  - Checks if user exists in context
  - Redirects to institution login if not authenticated
  - Allows access to protected pages if authenticated

---

### 3. **Pages (Feature Containers)**

Each page follows a consistent pattern:
- Gets auth data from `useAuth()` hook
- Uses `DashboardHeader` and `Sidebar` components
- Has mode-specific UI rendering (institution vs personal)
- Displays data in `GlassCard` components

#### `src/pages/Landing.tsx` ⭐
- **Purpose**: Marketing/home page
- **Key Features**:
  - Mode toggle (Institution/Personal) at top right
  - Dynamic hero section with mode-specific messaging
  - Feature cards showcasing platform capabilities
  - Security & privacy information
  - Step-by-step "How It Works" section
  - Call-to-action buttons routing to respective login pages
- **Key Logic**:
  - `mode` state manages Institution/Personal toggle
  - Content conditionally renders based on selected mode
  - Cards animate with staggered delays
  - Two distinct color schemes: institution (blue) and personal (purple)

#### `src/pages/Dashboard.tsx` ⭐⭐
- **Purpose**: Main dashboard showing overview and quick stats
- **Institution Mode Shows**:
  - Today's Schedule (Classes with times and rooms)
  - Assigned Tasks (from teachers with status badges)
  - Daily Report (completion metrics, utilization rates)
  - This Week calendar snapshot
- **Personal Mode Shows**:
  - Today's Plan (study blocks with checkboxes)
  - My Courses (progress bars with expected completion dates)
  - Goals & Focus (daily/weekly/monthly metrics)
  - Study hours tracking
- **Key Components**:
  - `ScheduleItem`: Displays single class
  - `StudyBlock`: Displays study task with completion checkbox
  - `TaskItem`: Displays assigned task with status
  - `CourseProgress`: Progress bar for courses
  - `MetricItem`: Progress metric display

#### `src/pages/Calendar.tsx` ⭐⭐
- **Purpose**: Calendar view with event management
- **Features**:
  - Month/Week view toggle
  - Interactive calendar grid with clickable dates
  - Selected date event panel on right
  - Color-coded event indicators
- **Institution Mode**:
  - Shows Classes (with time and room)
  - Shows Tasks from Teachers (with status)
  - Shows Exams (highlighted in red)
  - Legend includes Present/Absent indicators
- **Personal Mode**:
  - Shows Study Sessions (with duration)
  - Shows Goals and Checkpoints
  - Shows Exam Weeks (AI task paused)
  - Progress status with action buttons
- **Key Logic**:
  - Uses `date-fns` for date manipulation
  - Generates calendar grid from month start to month end
  - `getEventsForDay()`: Filters events for selected date
  - Mock events data organized by mode

#### `src/pages/Tasks.tsx` ⭐
- **Purpose**: Task management with AI chat integration
- **Features**:
  - Displays tasks from Supabase database
  - Real-time AI chat assistant for task queries
  - Stream-based response from Supabase Edge Function
  - Task status color coding
  - Priority indicators
- **Key Logic**:
  - `fetchTasks()`: GET from Supabase 'tasks' table
  - `sendMessage()`: 
    - Sends message to `/functions/v1/chat-with-ai`
    - Streams response using ReadableStream API
    - Parses server-sent events (SSE) format
    - Accumulates chunks into messages
  - Status colors: completed (green), in_progress (blue), overdue (red)
  - Priority colors: high (red), medium (amber)

#### `src/pages/Timetable.tsx`
- **Purpose**: Weekly grid view of scheduled tasks
- **Features**:
  - Week view with days and time slots (8 AM - 7 PM)
  - 12-hour time slot grid
  - Current day highlighting
  - Task display in appropriate time slots
- **Key Logic**:
  - `fetchTasks()`: Gets tasks with due_date from Supabase
  - `getTasksForSlot()`: Filters tasks matching day and hour
  - `timeSlots`: 8 AM to 7 PM (12 slots)
  - `weekDays`: Current week dates using date-fns
  - Status color mapping for task cells

#### `src/pages/Reports.tsx`
- **Purpose**: Progress and analytics dashboard
- **Key Metrics Displayed**:
  - Total tasks count
  - Completed tasks
  - In-progress tasks
  - Completion rate percentage
  - Active tasks progress
  - Overdue count
- **Features**:
  - Overview stat cards (4-column grid)
  - Detailed progress section with progress bars
  - Task breakdown chart
  - Due date analysis
- **Key Logic**:
  - `fetchTasks()`: Gets all tasks from Supabase
  - Calculates stats by filtering task statuses
  - Completion rate: (completed / total) * 100
  - Active rate: ((completed + in_progress) / total) * 100

#### `src/pages/Profile.tsx`
- **Purpose**: User account information display
- **Displays**:
  - User avatar (generated from email seed)
  - User name (from email username)
  - Account type badge (Institution/Personal)
  - Account details:
    - Email
    - Member since date (current date)
    - Account type and role
- **Key Logic**:
  - Gets user from `useAuth()` context
  - Extracts name from email (before @)
  - Uses Dicebear API for avatar generation

#### `src/pages/Settings.tsx`
- **Purpose**: User preferences and application settings
- **Sections**:
  - **Notifications**:
    - Task notifications toggle
    - Email notifications toggle
    - Task reminders toggle
  - **Appearance**:
    - Dark mode toggle
    - Compact mode toggle
  - **Language & Region** (partial implementation)
- **Key Logic**:
  - Uses UI Switch components for toggles
  - No persistence (UI only in current state)
  - Mode-specific icon colors

#### `src/pages/InstitutionLogin.tsx`
- **Purpose**: Institution user login page
- **Features**:
  - Email/username input
  - Password input
  - Forgot password link
  - Login button
  - Back to home button
  - Preview cards on right (Master Timetable, Teacher Network)
- **Key Logic**:
  - Pre-filled with demo credentials: `student.xyz@academy.edu`
  - Calls `login()` from AuthContext
  - Validates credentials against DEMO_USERS
  - Navigates to `/dashboard` on success
  - Shows error message on failure
  - Uses institution color scheme (blue)

#### `src/pages/PersonalLogin.tsx`
- **Purpose**: Personal learner login page
- **Similar to InstitutionLogin but**:
  - Pre-filled with personal demo credentials
  - Uses personal color scheme (purple)
  - Different messaging ("Learner" instead of institution)
  - Button text: "Log In" instead of institution-specific
  - Includes signup link to `/personal/signup`

#### `src/pages/PersonalSignup.tsx`
- **Purpose**: New personal account registration
- **Status**: Mentioned in routes but implementation not shown

#### `src/pages/NotFound.tsx`
- **Purpose**: 404 error page
- **Status**: Catch-all route for undefined paths

---

### 4. **Components (Reusable UI Elements)**

#### Core Dashboard Components

##### `src/components/DashboardHeader.tsx`
- **Purpose**: Top navigation bar for all dashboard pages
- **Features**:
  - Edulytics logo/brand
  - Mode indicator (Institution/Personal) with styled badge
  - Notification bell with pulse animation
  - User dropdown menu
- **Dropdown Menu Options**:
  - User email and username display
  - Profile link
  - Settings link
  - Logout button (destructive style)
- **Key Logic**:
  - Gets `user` and `logout()` from AuthContext
  - `handleLogout()`: Clears session and navigates to home
  - Notification dot colored by mode
  - Avatar uses Dicebear API

##### `src/components/Sidebar.tsx`
- **Purpose**: Left navigation menu for dashboard
- **Navigation Items** (All roles):
  1. Dashboard
  2. Calendar
  3. Tasks
  4. Timetable
  5. Reports
  6. Settings
- **Conditional Items**:
  - Teacher (Institution): Teacher Panel
  - Admin (Institution): Admin Panel
- **Key Logic**:
  - Exports `NavLink` component
  - Active route styling based on mode colors
  - Icons from lucide-react with hover scale animation
  - 264px fixed width sidebar with backdrop blur

##### `src/components/GlassCard.tsx`
- **Purpose**: Glass-morphism card component (primary UI element)
- **Props**:
  - `hover`: Boolean for hover effects
  - `className`: Additional classes
  - `children`: Card content
- **Styling**:
  - Backdrop blur effect
  - Semi-transparent background
  - Border with reduced opacity
  - Rounded corners (xl)
  - Hover scales and shadow on hover prop

##### `src/components/NavLink.tsx`
- **Purpose**: Active-aware navigation link
- **Props**:
  - `to`: Route path
  - `activeClassName`: Classes when route active
  - `children`: Link content
- **Key Logic**:
  - Wraps React Router Link
  - Applies activeClassName when location matches path

#### Feature-Specific Components

##### `src/components/ProgressBar.tsx`
- **Purpose**: Animated progress bar for schedules
- **Props**:
  - `value`: Progress percentage (0-100)
  - `mode`: 'institution' | 'personal' (color)
  - `className`: Additional styling

##### `src/components/StatCard.tsx`
- **Purpose**: Statistic display card (Landing page)
- **Props**:
  - `value`: Number or text to display
  - `label`: Description text

##### `src/components/FeatureCard.tsx`
- **Purpose**: Feature showcase card (Landing page)
- **Props**:
  - `icon`: Icon component
  - `title`: Feature name
  - `description`: Feature details
  - `mode`: 'institution' | 'personal'

##### `src/components/StepCard.tsx`
- **Purpose**: Step in process card (How It Works section)
- **Props**:
  - `step`: Step number (1-3)
  - `icon`: Icon component
  - `title`: Step title
  - `description`: Step details
  - `mode`: 'institution' | 'personal'

##### `src/components/SecurityCard.tsx`
- **Purpose**: Security feature badge
- **Props**:
  - `icon`: Security icon
  - `title`: Feature name
  - `mode`: 'institution' | 'personal'

##### `src/components/ModeToggle.tsx`
- **Purpose**: Institution/Personal mode switcher
- **Props**:
  - `mode`: Current mode
  - `onChange`: Callback when mode changes
- **Key Logic**:
  - Two toggle buttons for mode selection
  - Gradient text changes based on selection

##### `src/components/Footer.tsx`
- **Purpose**: Page footer (Landing page)

---

### 5. **UI Components Library** (`src/components/ui/`)

This directory contains shadcn/ui components (Radix UI + Tailwind):
- **Form Elements**: input.tsx, textarea.tsx, label.tsx
- **Interactive**: button.tsx, tabs.tsx, accordion.tsx, collapsible.tsx
- **Dialogs**: dialog.tsx, alert-dialog.tsx, drawer.tsx, sheet.tsx
- **Data Display**: table.tsx, progress.tsx, badge.tsx, skeleton.tsx
- **Dropdowns**: dropdown-menu.tsx, select.tsx, command.tsx
- **Navigation**: navigation-menu.tsx, breadcrumb.tsx, pagination.tsx
- **Feedback**: toast.tsx, toaster.tsx (sonner), alert.tsx
- **Popovers**: popover.tsx, tooltip.tsx, hover-card.tsx, context-menu.tsx
- **Layout**: card.tsx, separator.tsx, scroll-area.tsx, resizable.tsx
- **Media**: avatar.tsx, carousel.tsx, aspect-ratio.tsx
- **Theme**: use-toast.ts hook

---

### 6. **Hooks** (`src/hooks/`)

#### `src/hooks/use-toast.ts`
- **Purpose**: Toast notification system
- **Imported from**: @/components/ui/toast
- **Usage**: Used in Tasks page for showing success/error messages
- **Methods**: `toast()` function to show toast notifications

#### `src/hooks/use-mobile.tsx`
- **Purpose**: Responsive design hook
- **Logic**: Likely detects if viewport is mobile-sized

---

### 7. **Integration Services** (`src/integrations/`)

#### `src/integrations/supabase/client.ts`
- **Purpose**: Supabase client initialization
- **Key Configuration**:
  - Creates Supabase client with environment variables
  - `VITE_SUPABASE_URL`: Supabase project URL
  - `VITE_SUPABASE_PUBLISHABLE_KEY`: Public API key
  - Auth configuration:
    - Uses localStorage for persistence
    - Auto-refreshes tokens
    - Persistent sessions enabled
- **Exports**: `supabase` client object
- **Usage**: Imported in Tasks, Timetable, Reports pages

#### `src/integrations/supabase/types.ts`
- **Purpose**: TypeScript types for Supabase database schema
- **Status**: Auto-generated from Supabase

---

### 8. **Utilities** (`src/lib/`)

#### `src/lib/utils.ts`
- **Purpose**: Utility functions
- **Key Function**: `cn()` from clsx and tailwind-merge
  - Combines CSS class names intelligently
  - Handles conflicting Tailwind classes
  - Used throughout components for dynamic styling

---

### 9. **Styling**

#### `src/index.css` & `src/App.css`
- **Framework**: Tailwind CSS + PostCSS
- **Custom Animations**:
  - `animate-float`: Floating particle effect
  - `animate-fade-in`: Fade in animation
  - `animate-slide-up`: Slide up animation
  - `animate-pulse`: Pulsing notification dot
- **Color Variables** (CSS Custom Properties):
  - `--institution`: Blue theme colors
  - `--personal`: Purple theme colors
  - `--institution-glow`, `--personal-glow`: Gradient colors
  - `--foreground`, `--background`, `--card`: Theme colors
  - `--muted-foreground`, `--border`: Subtle colors

#### `tailwind.config.ts`
- **Theme Configuration**:
  - Dark mode preferred
  - Custom color palette with institution/personal colors
  - Extended animation timings
  - Border radius utilities

---

## 🔄 Data Flow Architecture

### Authentication Flow
```
User Input (Email/Password)
    ↓
InstitutionLogin/PersonalLogin Page
    ↓
AuthContext.login() Method
    ↓
DEMO_USERS Validation
    ↓
localStorage.setItem('edulytics_auth')
    ↓
useAuth() Hook Updates
    ↓
Navigate to /dashboard
    ↓
ProtectedRoute Allows Access
```

### Dashboard Data Flow
```
Dashboard Page Mounts
    ↓
useAuth() Retrieves Mode & Role
    ↓
Conditional Rendering (Institution vs Personal)
    ↓
Sub-components Display Mode-Specific Data
    ↓
Child Components (ScheduleItem, TaskItem, etc.)
    ↓
User Interaction (Clicking, Checking boxes)
    ↓
Local State Update (useState)
```

### Task Management Flow (with Backend)
```
Tasks Page Mounts
    ↓
fetchTasks() → supabase.from('tasks').select()
    ↓
Supabase Returns Task Data
    ↓
setTasks() Updates state
    ↓
Tasks Rendered in UI
    ↓
User Sends Chat Message
    ↓
sendMessage() → Edge Function 'chat-with-ai'
    ↓
Stream Response with ReadableStream API
    ↓
Parse SSE Format
    ↓
Update Messages State Progressively
    ↓
Display AI Response
```

---

## 🎨 Design System

### Color Scheme
- **Institution Mode**: Blue (#3B82F6) with gradient glow
- **Personal Mode**: Purple (#A855F7) with gradient glow
- **Base Dark Background**: Very dark gray with overlay
- **Cards**: Semi-transparent with backdrop blur (glass effect)
- **Text**: Light foreground on dark background

### Typography
- **Headings**: Bold, large sizes (h1-h3)
- **Body**: Medium weight, readable contrast
- **Labels**: Small caps, muted for secondary info

### Spacing
- **Containers**: max-width-xl to 7xl with horizontal padding
- **Cards**: Standard padding, margin between sections
- **Components**: Consistent gap values (2-4 units)

### Animations
- **Entrance**: Fade-in and slide-up on page load
- **Hover**: Smooth scale and shadow transitions
- **Status**: Pulse animations for notifications
- **Floating**: Continuous floating particles in background

---

## 🔌 Integration Points

### Supabase Integration
Currently implemented:
- **Tasks Table**: Read operations in Tasks, Timetable, Reports pages
- **Chat API**: Edge Function `chat-with-ai` for AI responses

Tables likely to exist (based on schema):
- `tasks`: { id, title, description, status, priority, due_date, course, created_at }
- `users`: User accounts (not directly used in frontend auth)
- `courses`: Course information
- `timetable_entries`: Schedule items

### External APIs
- **Dicebear API**: Avatar generation from seed
- **OpenAI (via Supabase Edge Function)**: AI chat responses

---

## 🔐 Security Features

### Frontend Security
- **Protected Routes**: Unauthenticated users redirected to login
- **localStorage Auth**: Persistent session management
- **Role-Based Access**: UI hidden/shown based on user role
- **Demo Only**: No real credentials stored

### Backend Security (Supabase)
- **Public Key**: Supabase-managed authentication
- **Edge Functions**: Serverless security for AI operations
- **GDPR/Compliance**: Claimed in marketing copy

---

## 📊 State Management

### Global State
- **AuthContext**: User data, login/logout, mode, role

### Local State (Component-Level)
- **Pages**: Dashboard views, calendar selection, form inputs
- **Components**: Checkbox states, dropdown menus, toggles

### Server State
- **React Query**: Cached Supabase queries (configured but minimal usage)
- **Supabase**: Real database source of truth

---

## 🚀 Key Technologies Used

| Technology | Purpose |
|---|---|
| React 18.3 | UI framework |
| TypeScript | Type safety |
| Vite 5.4 | Build tool and dev server |
| React Router 6.30 | Client-side routing |
| React Query 5.83 | Server state management |
| Tailwind CSS 3.4 | Styling |
| shadcn/ui | Component library (Radix + Tailwind) |
| Supabase 2.84 | Backend/Database |
| date-fns 3.6 | Date manipulation |
| Recharts 2.15 | Charts & data visualization (included but minimal use) |
| React Hook Form 7.61 | Form handling |
| Zod 3.25 | Schema validation |
| Sonner 1.7 | Toast notifications |
| Lucide React 0.462 | Icons |

---

## 📦 Project Dependencies Summary

### Dependencies (23 packages)
- UI: @radix-ui/* (forms, dialogs, navigation, etc.)
- State: @tanstack/react-query, react-hook-form
- Styling: tailwindcss, next-themes, class-variance-authority
- Backend: @supabase/supabase-js
- Utils: date-fns, zod, clsx, tailwind-merge
- Icons: lucide-react

### DevDependencies (13 packages)
- Build: vite, @vitejs/plugin-react-swc
- Types: typescript, @types/react, @types/node
- Linting: eslint with plugins
- Styles: tailwindcss, autoprefixer, postcss
- Tools: lovable-tagger (Lovable IDE integration)

---

## 🎯 Feature Completeness

### ✅ Implemented
- Landing page with mode selection
- Dual authentication (Institution & Personal)
- Dashboard with role-specific views
- Calendar with event display
- Task management with Supabase integration
- Weekly timetable view
- Progress reports and analytics
- User profile display
- Settings interface
- AI chat assistant (Tasks page)
- Responsive design with dark mode
- Glass-morphism UI throughout

### 🔄 Partially Implemented
- Settings (UI only, no persistence)
- Timetable (displays Supabase data but no creation)
- Reports (basic metrics, could expand)

### ❌ Not Implemented
- Real authentication (demo only)
- Task creation/editing
- User registration (form exists, not functional)
- Real-time notifications
- Export/Print functionality
- Admin/Teacher panels (routes exist, pages missing)
- Attendance marking

---

## 🏃 Running the Application

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Linting
npm run lint
```

---

## 🔗 Routing Map

```
/
├── Landing (public)
├── /institution/login (public)
├── /personal/login (public)
├── /personal/signup (public)
├── /dashboard (protected) ⭐
├── /calendar (protected)
├── /tasks (protected) with AI chat
├── /timetable (protected)
├── /reports (protected)
├── /profile (protected)
├── /settings (protected)
└── * (NotFound page)
```

Protected routes require authentication via `/institution/login` or `/personal/login`.

---

## 💡 Key Insights for Development

### Mode System
The entire application operates in two modes:
1. **Institution Mode**: Managing educational institution workflows
2. **Personal Mode**: Managing individual learning journeys

Mode is stored in auth context and used to:
- Change UI text and messaging
- Swap color schemes (blue ↔ purple)
- Determine feature availability
- Customize metrics and displays

### User Roles
Three role levels for permission granularity:
- **Student**: Basic access to own data
- **Teacher**: Can manage assignments (not fully implemented)
- **Admin**: Administrative functions (not fully implemented)

### Component Patterns
- All major pages use `DashboardHeader` + `Sidebar` layout
- Data displayed in `GlassCard` containers
- Icons from `lucide-react`
- Animations via Tailwind utilities
- Responsive grid layouts (mobile → tablet → desktop)

### Data Persistence
- **User Auth**: localStorage
- **Tasks**: Supabase database
- **UI State**: Component state (temporary)
- **Preferences**: Settings page (not persisted yet)

---

## 📝 Notes for Future Development

1. **Authentication**: Replace demo auth with real JWT/OAuth
2. **Database**: Implement full CRUD operations for tasks
3. **Real-time**: Add WebSocket for live updates
4. **Testing**: Add unit and integration tests
5. **Performance**: Implement code splitting and lazy loading
6. **Admin Panels**: Complete teacher and admin dashboards
7. **Mobile**: Further optimize for mobile devices
8. **Accessibility**: Add ARIA labels and keyboard navigation
9. **Analytics**: Integrate user analytics tracking
10. **Notifications**: Implement push notifications

---

**Generated on**: December 1, 2025
**Project Repository**: Edulytics by TanayV24
**Frontend Status**: Feature-complete demo with backend integration ready
