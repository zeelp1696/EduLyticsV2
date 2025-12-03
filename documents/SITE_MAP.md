# Edulytics - Site Map & Feature Overview

## 🗺️ Complete Site Structure

```
EDULYTICS APPLICATION
│
├── PUBLIC PAGES (No Authentication Required)
│   │
│   ├── / (Landing Page)
│   │   ├── Header
│   │   │   ├── Logo
│   │   │   └── Mode Toggle (Institution/Personal)
│   │   │
│   │   ├── Hero Section
│   │   │   ├── Headline (Mode-specific)
│   │   │   ├── Description (Mode-specific)
│   │   │   ├── CTA Buttons
│   │   │   └── Preview Cards (3x Animated)
│   │   │
│   │   ├── Features Section
│   │   │   ├── Master Timetables (Feature Card)
│   │   │   ├── Teacher Task Management (Feature Card)
│   │   │   ├── Verification Flow (Feature Card)
│   │   │   └── Multi-Role Access (Feature Card)
│   │   │
│   │   ├── How It Works Section
│   │   │   ├── Step 1: Create Account (Step Card)
│   │   │   ├── Step 2: Set Up Schedule (Step Card)
│   │   │   └── Step 3: Track & Optimize (Step Card)
│   │   │
│   │   ├── Security Section
│   │   │   ├── End-to-End Encryption (Security Card)
│   │   │   ├── JWT Authentication (Security Card)
│   │   │   ├── Role-Based Access (Security Card)
│   │   │   ├── Private Data Storage (Security Card)
│   │   │   ├── Audit Logging (Security Card)
│   │   │   └── GDPR Compliant (Security Card)
│   │   │
│   │   └── Footer
│   │
│   ├── /institution/login
│   │   ├── Left Side: Login Form
│   │   │   ├── Title
│   │   │   ├── Description
│   │   │   ├── Email/Username Input
│   │   │   ├── Password Input
│   │   │   ├── Forgot Password Link
│   │   │   ├── Login Button
│   │   │   └── Back to Home Button
│   │   │
│   │   └── Right Side: Preview Cards (Hidden on Mobile)
│   │       ├── Master Timetable Card
│   │       └── Teacher Network Card
│   │
│   ├── /personal/login
│   │   ├── Login Form
│   │   │   ├── Title
│   │   │   ├── Description
│   │   │   ├── Email Input
│   │   │   ├── Password Input
│   │   │   ├── Forgot Password Link
│   │   │   ├── Login Button
│   │   │   ├── Create Account Link
│   │   │   └── Back to Home Button
│   │   │
│   │   └── Background Animation
│   │
│   ├── /personal/signup
│   │   └── [Registration Form - Placeholder]
│   │
│   └── /* (404 Not Found Page)
│
│
├── PROTECTED PAGES (Requires Authentication)
│   │
│   ├── HEADER (All Protected Pages)
│   │   ├── Logo
│   │   ├── Mode Indicator Badge
│   │   ├── Notification Bell
│   │   └── User Dropdown Menu
│   │       ├── User Info Display
│   │       ├── Profile Link
│   │       ├── Settings Link
│   │       └── Logout Button
│   │
│   ├── SIDEBAR (All Protected Pages)
│   │   ├── Dashboard Link
│   │   ├── Calendar Link
│   │   ├── Tasks Link
│   │   ├── Timetable Link
│   │   ├── Reports Link
│   │   ├── [Conditional] Teacher Panel (if Teacher)
│   │   ├── [Conditional] Admin Panel (if Admin)
│   │   └── Settings Link
│   │
│   ├── /dashboard
│   │   │
│   │   ├── INSTITUTION MODE
│   │   │   ├── Page Title: "Institution Overview"
│   │   │   │
│   │   │   ├── Main Content (2/3 width)
│   │   │   │   ├── Card: Today's Schedule
│   │   │   │   │   └── Schedule Items (5x)
│   │   │   │   │       ├── Time
│   │   │   │   │       ├── Subject
│   │   │   │   │       ├── Room
│   │   │   │   │       └── Type Badge
│   │   │   │   │
│   │   │   │   └── Card: Assigned Tasks
│   │   │   │       ├── Task Items (4x)
│   │   │   │       │   ├── Task Name
│   │   │   │       │   ├── Course
│   │   │   │       │   ├── Due Date
│   │   │   │       │   └── Status Badge
│   │   │   │       └── View All Tasks Button
│   │   │   │
│   │   │   └── Side Content (1/3 width)
│   │   │       ├── Card: This Week
│   │   │       │   └── Day Indicators (5x)
│   │   │       │
│   │   │       └── Card: Daily Report
│   │   │           ├── Tasks Completed: 4/6
│   │   │           ├── Timetable Utilization: 85%
│   │   │           ├── On-time Submissions: 92%
│   │   │           └── Verification Note
│   │   │
│   │   └── PERSONAL MODE
│   │       ├── Page Title: "Your Learning Space"
│   │       │
│   │       ├── Main Content (2/3 width)
│   │       │   ├── Card: Today's Plan
│   │       │   │   └── Study Blocks (4x)
│   │       │   │       ├── Checkbox
│   │       │   │       ├── Task Name
│   │       │   │       └── Duration
│   │       │   │
│   │       │   └── Card: My Courses
│   │       │       ├── Course Progress Items (4x)
│   │       │       │   ├── Course Name
│   │       │       │   ├── Progress Bar
│   │       │       │   ├── ECD (Expected Completion Date)
│   │       │       │   └── Days Behind Badge (if applicable)
│   │       │       └── Percentage Complete
│   │       │
│   │       └── Side Content (1/3 width)
│   │           ├── Card: This Week
│   │           │   └── Day Indicators (5x)
│   │           │
│   │           └── Card: Goals & Focus
│   │               ├── Daily/Weekly/Monthly Tabs
│   │               ├── Study Hours: 5/6
│   │               ├── Tasks Completed: 8/10
│   │               ├── Progress Bars
│   │               └── Status Message
│   │
│   ├── /calendar
│   │   │
│   │   ├── Calendar Section (2/3 width)
│   │   │   ├── Controls
│   │   │   │   ├── Previous/Next Month Buttons
│   │   │   │   ├── Month/Year Display
│   │   │   │   └── View Mode Tabs (Month/Week)
│   │   │   │
│   │   │   ├── Calendar Grid
│   │   │   │   ├── Day Headers (Sun-Sat)
│   │   │   │   └── Calendar Cells (5-6 weeks)
│   │   │   │       ├── Date Number
│   │   │   │       ├── Event Indicators
│   │   │   │       │   ├── Class Bar (colored)
│   │   │   │       │   ├── Task Dots (amber)
│   │   │   │       │   └── Exam Bar (red)
│   │   │   │       ├── Event Count Badge
│   │   │   │       └── Click Handler
│   │   │   │
│   │   │   └── Legend
│   │   │       ├── Classes/Study Sessions
│   │   │       ├── Tasks
│   │   │       ├── Exams
│   │   │       ├── [Institution Only] Present
│   │   │       └── [Institution Only] Absent
│   │   │
│   │   └── Details Panel (1/3 width)
│   │       ├── Selected Date Display
│   │       │
│   │       └── INSTITUTION MODE
│   │           ├── Classes Section
│   │           │   └── Class Items (with time, room)
│   │           ├── Tasks Section
│   │           │   └── Task Items (with status)
│   │           └── Exams Section
│   │               └── Exam Items (with time, room)
│   │
│   │       OR PERSONAL MODE
│   │           ├── Today's Plan Section
│   │           │   └── Study Tasks (with checkboxes)
│   │           ├── Goals Section
│   │           │   └── Goal Items
│   │           ├── Exam Week Notice (if applicable)
│   │           └── Progress Status Card
│   │               ├── Status Message
│   │               ├── Distribute Missed Work Button
│   │               └── Extend Deadline Button
│   │
│   ├── /tasks
│   │   ├── Task List Section
│   │   │   ├── Filter/Search Options
│   │   │   │
│   │   │   └── Task Items (from Supabase)
│   │   │       ├── Title
│   │   │       ├── Description
│   │   │       ├── Status Badge (color-coded)
│   │   │       ├── Priority Badge (color-coded)
│   │   │       ├── Due Date
│   │   │       └── Course (if applicable)
│   │   │
│   │   └── AI Chat Assistant Section
│   │       ├── Chat Message Display
│   │       │   ├── User Messages (right-aligned)
│   │       │   └── Assistant Messages (left-aligned)
│   │       │
│   │       └── Chat Input
│   │           ├── Text Input Field
│   │           └── Send Button
│   │
│   ├── /timetable
│   │   ├── Title: "Weekly Timetable"
│   │   ├── Week Range Display
│   │   │
│   │   └── Grid View
│   │       ├── Header Row
│   │       │   ├── Time Column
│   │       │   └── Day Columns (Mon-Sun)
│   │       │       └── Date Numbers
│   │       │
│   │       └── Time Slot Rows (8 AM - 7 PM)
│   │           ├── Hour Label
│   │           └── Day Cells (7 columns)
│   │               ├── Task Items (color by status)
│   │               ├── Course Name
│   │               └── Status Styling
│   │
│   │       └── Legend
│   │           ├── Completed (green)
│   │           ├── In Progress (blue)
│   │           ├── Pending (gray)
│   │           └── Overdue (red)
│   │
│   ├── /reports
│   │   ├── Title: "Progress Reports"
│   │   │
│   │   ├── Overview Stats (4-column grid)
│   │   │   ├── Total Tasks Stat Card
│   │   │   ├── Completed Stat Card
│   │   │   ├── In Progress Stat Card
│   │   │   └── Completion Rate % Stat Card
│   │   │
│   │   ├── Overall Progress Section
│   │   │   ├── Completion Rate Bar
│   │   │   ├── Active Tasks Progress Bar
│   │   │   └── Done vs Overdue Grid
│   │   │
│   │   ├── Task Breakdown Section
│   │   │   ├── Status Distribution
│   │   │   ├── Task List by Status
│   │   │   └── Filter Options
│   │   │
│   │   └── Due Date Analysis Section
│   │       ├── Upcoming Tasks
│   │       ├── Overdue Tasks
│   │       └── This Week Summary
│   │
│   ├── /profile
│   │   ├── Left Column (1/3)
│   │   │   └── Profile Card
│   │   │       ├── Avatar Image
│   │   │       ├── User Name
│   │   │       ├── Role Badge
│   │   │       └── Account Type Badge
│   │   │
│   │   └── Right Column (2/3)
│   │       └── Account Details Card
│   │           ├── Email Section
│   │           │   ├── Icon
│   │           │   ├── Label
│   │           │   └── Email Value
│   │           │
│   │           ├── Member Since Section
│   │           │   ├── Icon
│   │           │   ├── Label
│   │           │   └── Join Date
│   │           │
│   │           └── Account Type Section
│   │               ├── Icon
│   │               ├── Label
│   │               └── Type & Role
│   │
│   └── /settings
│       ├── Title: "Settings"
│       │
│       ├── Notifications Section
│       │   ├── Task Notifications Toggle
│       │   ├── Email Notifications Toggle
│       │   └── Task Reminders Toggle
│       │
│       ├── Appearance Section
│       │   ├── Dark Mode Toggle
│       │   └── Compact Mode Toggle
│       │
│       └── Language & Region Section
│           └── [Coming Soon]
│
```

---

## 🎯 Feature Matrix by Mode

### Institution Mode Features
| Feature | Location | Implementation |
|---------|----------|-----------------|
| Master Timetable | Dashboard, Calendar | Mock data |
| Classes Display | Dashboard, Calendar | ScheduleItem components |
| Teacher Tasks | Dashboard | TaskItem components |
| Task Verification | Reports | Status badges |
| Weekly Schedule | Timetable | Grid view |
| Daily Report | Dashboard | Metrics card |
| Teacher Panel | Sidebar (if teacher) | Not yet implemented |
| Admin Panel | Sidebar (if admin) | Not yet implemented |
| Attendance | Calendar | Indicators |

### Personal Mode Features
| Feature | Location | Implementation |
|---------|----------|-----------------|
| Study Schedule | Dashboard, Calendar | StudyBlock components |
| Course Progress | Dashboard | CourseProgress bars |
| Study Goals | Dashboard, Calendar | Goals section |
| Goal Tracking | Dashboard | Daily/Weekly/Monthly tabs |
| Days Behind | Dashboard, Calendar | Badge indicator |
| AI Study Assistant | Tasks | Chat interface |
| Catch-up Help | Calendar | Action buttons |
| Study Hours | Dashboard | Metric tracking |

---

## 📊 Component Usage by Page

```
Landing.tsx
├── ModeToggle         ← Mode selector
├── GlassCard          ← 3x preview cards
├── StatCard           ← 3x statistics
├── ProgressBar        ← Progress visualization
├── FeatureCard        ← 4x feature cards
├── StepCard           ← 3x process steps
├── SecurityCard       ← 6x security badges
└── Footer             ← Page footer

InstitutionLogin.tsx
├── GlassCard          ← 2x (form + preview)
├── ProgressBar        ← Optional preview
└── [Form elements]    ← Input, Label, Button

PersonalLogin.tsx
├── GlassCard          ← Form container
└── [Form elements]    ← Input, Label, Button

Dashboard.tsx
├── DashboardHeader    ← Top bar
├── Sidebar            ← Left nav
├── GlassCard          ← 3x content cards
├── ScheduleItem       ← Multiple items
├── StudyBlock         ← Multiple items
├── TaskItem           ← Multiple items
├── CourseProgress     ← Multiple items
├── Progress           ← Progress bar
├── Checkbox           ← In study blocks
├── Badge              ← Status badges
└── MetricItem         ← Metric display

Calendar.tsx
├── DashboardHeader    ← Top bar
├── Sidebar            ← Left nav
├── GlassCard          ← 2x major cards
├── Button             ← Month nav, view mode
├── Badge              ← Task status
├── Checkbox           ← Study completion
└── TaskStatusBadge    ← Status display

Tasks.tsx
├── DashboardHeader    ← Top bar
├── Sidebar            ← Left nav
├── GlassCard          ← Task list + chat
├── Badge              ← Status/priority
├── Input              ← Chat input
├── Button             ← Chat send
└── [Chat UI]          ← Message display

Timetable.tsx
├── DashboardHeader    ← Top bar
├── Sidebar            ← Left nav
├── GlassCard          ← Timetable container
├── Badge              ← Status badges
└── [Grid]             ← Time slot grid

Reports.tsx
├── DashboardHeader    ← Top bar
├── Sidebar            ← Left nav
├── GlassCard          ← Multiple sections
├── Progress           ← Progress bars
├── Badge              ← Status badges
├── TrendingUp icon    ← Chart icon
└── [Stats cards]      ← 4x overview

Profile.tsx
├── DashboardHeader    ← Top bar
├── Sidebar            ← Left nav
├── GlassCard          ← 2x profile cards
├── Avatar             ← User avatar
├── Badge              ← Type badges
└── [Icons]            ← Info icons

Settings.tsx
├── DashboardHeader    ← Top bar
├── Sidebar            ← Left nav
├── GlassCard          ← 3x sections
├── Switch             ← Toggle switches
├── Label              ← Toggle labels
├── Button             ← Action buttons
└── [Icons]            ← Section icons
```

---

## 🔗 Navigation Relationships

```
Public Entry Points:
├── /                    (Landing - Entry point)
│   └── mode selector
│       ├── Institution → /institution/login
│       └── Personal → /personal/login
│
├── /institution/login   (Institution entry)
│   ├── Demo credentials
│   └── Redirects to /dashboard
│
├── /personal/login      (Personal entry)
│   ├── Demo credentials
│   ├── Sign up link → /personal/signup
│   └── Redirects to /dashboard
│
└── /personal/signup     (Registration - Not functional)


Protected Dashboard (all protected by ProtectedRoute):
├── /dashboard           (Primary hub)
│   ├── Sidebar nav
│   │   ├── → /dashboard (current)
│   │   ├── → /calendar
│   │   ├── → /tasks
│   │   ├── → /timetable
│   │   ├── → /reports
│   │   ├── → [/teacher-panel] if teacher
│   │   ├── → [/admin-panel] if admin
│   │   └── → /settings
│   │
│   └── Header menu
│       ├── → /profile
│       ├── → /settings
│       └── Logout → /

├── /calendar            (Views schedule)
│   ├── Same navigation
│   └── Links between /calendar ↔ /dashboard

├── /tasks               (AI chat here)
│   ├── Same navigation
│   └── Fetches from Supabase

├── /timetable           (Grid view)
│   ├── Same navigation
│   └── Weekly display

├── /reports             (Analytics)
│   ├── Same navigation
│   └── Statistics display

├── /profile             (User info)
│   ├── Same navigation
│   └── Read-only display

└── /settings            (Preferences)
    ├── Same navigation
    └── Toggle switches


Error Route:
└── /*                   (404 Not Found)
    └── Back to home link
```

---

## 📈 Data Model Overview

### User (From AuthContext)
```typescript
{
  email: string
  password: string       // Demo only
  mode: "institution" | "personal"
  role: "student" | "teacher" | "admin"
}
```

### Task (From Supabase)
```typescript
{
  id: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  priority: "low" | "medium" | "high"
  due_date?: timestamp
  course?: string
  created_at: timestamp
  updated_at: timestamp
}
```

### Message (Chat)
```typescript
{
  role: "user" | "assistant"
  content: string
}
```

---

## 🎨 Color & Theme Mapping

### Institution Mode (Blue)
- Primary: `#3B82F6` (Blue)
- Glow: `#60A5FA` (Light Blue)
- UI Text: "text-institution"
- UI Background: "bg-institution/20"
- Active State: "bg-institution/20 border-l-4 border-institution"

### Personal Mode (Purple)
- Primary: `#A855F7` (Purple)
- Glow: `#D8B4FE` (Light Purple)
- UI Text: "text-personal"
- UI Background: "bg-personal/20"
- Active State: "bg-personal/20 border-l-4 border-personal"

### Status Colors (Universal)
- Success: `#22C55E` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)

---

**Site map generated for Edulytics**
**December 1, 2025**
