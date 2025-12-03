# Edulytics - Architecture & Logic Diagrams

## 1. Component Hierarchy Tree

```
App.tsx (Root)
├── BrowserRouter (React Router)
├── QueryClientProvider (React Query)
├── TooltipProvider (shadcn)
├── Toaster (shadcn Toast)
├── Sonner (Toast Notifications)
└── AuthProvider (AuthContext)
    └── Routes
        ├── Landing (/)
        │   ├── Header
        │   ├── Hero Section
        │   ├── Features Section (4x FeatureCard)
        │   ├── How It Works (3x StepCard)
        │   ├── Security Section (6x SecurityCard)
        │   └── Footer
        │
        ├── InstitutionLogin (/institution/login)
        │   ├── GlassCard (Form)
        │   └── GlassCard (Preview Cards - Right Side)
        │
        ├── PersonalLogin (/personal/login)
        │   └── GlassCard (Form)
        │
        ├── ProtectedRoute (Wrapper)
        │   ├── Dashboard (/dashboard)
        │   │   ├── DashboardHeader
        │   │   ├── Sidebar
        │   │   └── Main Content
        │   │       ├── GlassCard (Today's Schedule/Plan)
        │   │       │   └── ScheduleItem OR StudyBlock (x5)
        │   │       ├── GlassCard (Tasks/Courses)
        │   │       │   └── TaskItem OR CourseProgress (x4)
        │   │       ├── GlassCard (Calendar Snapshot)
        │   │       └── GlassCard (Daily Report/Goals)
        │   │
        │   ├── Calendar (/calendar)
        │   │   ├── DashboardHeader
        │   │   ├── Sidebar
        │   │   └── Main Content
        │   │       ├── GlassCard (Calendar Grid & Controls)
        │   │       │   └── Calendar Days (7x7 Grid)
        │   │       │       └── Day Cell (with event markers)
        │   │       └── GlassCard (Selected Day Details)
        │   │           ├── Classes Section
        │   │           ├── Tasks Section
        │   │           └── Exams OR Goals Section
        │   │
        │   ├── Tasks (/tasks)
        │   │   ├── DashboardHeader
        │   │   ├── Sidebar
        │   │   └── Main Content
        │   │       ├── Task List
        │   │       │   └── Task Items (from Supabase)
        │   │       └── Chat Interface
        │   │           ├── Message Display Area
        │   │           ├── Text Input
        │   │           └── Send Button
        │   │
        │   ├── Timetable (/timetable)
        │   │   ├── DashboardHeader
        │   │   ├── Sidebar
        │   │   └── GlassCard (Week View)
        │   │       └── 8 columns x 12 rows grid
        │   │           └── Time Slot Cells
        │   │
        │   ├── Reports (/reports)
        │   │   ├── DashboardHeader
        │   │   ├── Sidebar
        │   │   └── Main Content
        │   │       ├── Stat Cards (4x)
        │   │       ├── Overall Progress Card
        │   │       ├── Task Breakdown Card
        │   │       └── Due Date Analysis
        │   │
        │   ├── Profile (/profile)
        │   │   ├── DashboardHeader
        │   │   ├── Sidebar
        │   │   └── Main Content
        │   │       ├── Profile Card (Avatar, Name, Type)
        │   │       └── Details Card (Email, Member Since, Type)
        │   │
        │   └── Settings (/settings)
        │       ├── DashboardHeader
        │       ├── Sidebar
        │       └── Main Content
        │           ├── Notifications Section
        │           ├── Appearance Section
        │           └── Language & Region Section
        │
        └── NotFound (/* catch-all)
```

---

## 2. Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION START                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            AuthProvider Mounts                               │
│  • Checks localStorage for 'edulytics_auth'                 │
│  • Restores user session if exists                          │
│  • Sets initial state                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
    ┌──────────────┐        ┌──────────────┐
    │ User Exists  │        │ No User      │
    └──────────────┘        └──────────────┘
          │                        │
          │ Render Protected       │ Render Landing
          │ Routes Available       │ Routes Available
          │                        │
          ▼                        ▼
    ┌──────────────┐        ┌────────────────────┐
    │ Dashboard    │        │ Landing Page       │
    │ Calendar     │        │ Institution Login  │
    │ Tasks etc    │        │ Personal Login     │
    └──────────────┘        └─────────┬──────────┘
                                      │
                    ┌─────────────────┘
                    │
    ┌───────────────▼──────────────────┐
    │  User Enters Credentials         │
    │  • Email                         │
    │  • Password                      │
    └─────────────┬────────────────────┘
                  │
                  ▼
    ┌─────────────────────────────────┐
    │  AuthContext.login()            │
    │  Validates against DEMO_USERS   │
    └──────┬────────────────┬─────────┘
           │                │
    ┌──────▼──┐     ┌───────▼──────┐
    │ Valid   │     │ Invalid      │
    └──────┬──┘     └───────┬──────┘
           │                │
           │         Show Error
           │         Message
           ▼                │
    ┌──────────────────┐    │
    │ localStorage.set │    │
    │ 'edulytics_auth' │    │
    └─────────┬────────┘    │
              │             │
              ▼             │
    ┌──────────────────┐    │
    │ Update Context   │    │
    │ • user           │    │
    │ • mode           │    │
    │ • role           │    │
    └─────────┬────────┘    │
              │             │
              ▼             │
    ┌──────────────────┐    │
    │ Navigate to      │    │
    │ /dashboard       │    │
    │ (Success)        │    │
    └──────────────────┘    │
                            │
                    ┌───────▼───────┐
                    │ User Retries  │
                    └───────────────┘
```

---

## 3. Dashboard Mode System

```
                    ┌──────────────────┐
                    │ Dashboard Load   │
                    └────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │ useAuth()       │
                    │ Get: mode/role  │
                    └────────┬────────┘
                             │
            ┌────────────────┴─────────────────┐
            │                                  │
            ▼                                  ▼
    ┌──────────────────┐            ┌──────────────────┐
    │ INSTITUTION MODE │            │ PERSONAL MODE    │
    │ (Blue Colors)    │            │ (Purple Colors)  │
    └────────┬─────────┘            └────────┬─────────┘
             │                               │
             │ Display:                      │ Display:
             │ • Master Timetable            │ • Today's Plan
             │ • Teacher Tasks               │ • My Courses
             │ • Today's Schedule            │ • Study Hours
             │ • Daily Report                │ • Goals & Focus
             │ • Task Status Badges          │ • Checkboxes
             │   - Assigned                  │ • Progress Bars
             │   - Submitted                 │ • Days Behind
             │   - Verified                  │ • Catch-up Help
             │   - Overdue                   │
             │                               │
             │ Colors: Blue (#3B82F6)        │ Colors: Purple (#A855F7)
             │ Icons: Blue tint              │ Icons: Purple tint
             │ Badges: Institution theme    │ Badges: Personal theme
             │                               │
             └──────────┬─────────────────────┘
                        │
            ┌───────────▼───────────┐
            │ Sidebar (Mode-Based)  │
            │ • Same nav items      │
            │ • Color: Blue/Purple  │
            │ • Active state color  │
            └───────────────────────┘
```

---

## 4. Page Data Flow (Tasks Page Example)

```
┌──────────────────────┐
│ Tasks Page Mounts    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────┐
│ useEffect Hook                   │
│ Runs once on mount               │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ fetchTasks()                     │
│ • Creates Supabase client        │
│ • SELECT * FROM tasks            │
│ • ORDER BY created_at DESC       │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Network Request to Supabase      │
│ Database                         │
└──────────┬───────────────────────┘
           │
      ┌────┴─────┐
      │           │
      ▼           ▼
  ┌─────┐   ┌──────────┐
  │Data │   │Error     │
  │OK   │   │Handler   │
  └──┬──┘   └────┬─────┘
     │           │
     │        Show Toast
     │        Error Alert
     ▼           │
 setTasks()      │
 (Update State)  │
     │           │
     ▼           ▼
┌─────────────────────────────────┐
│ UI Renders Task List            │
│ • Maps over tasks array         │
│ • Shows status badges           │
│ • Shows priority colors         │
│ • Shows course info             │
└─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────┐
│ User Types Message in Chat       │
│ • Input: "Create task plan"      │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ sendMessage()                    │
│ • Validates input (trim)         │
│ • Prevents duplicate sends       │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ setMessages() - Add user message │
│ to conversation history          │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ POST to Supabase Edge Function   │
│ /functions/v1/chat-with-ai       │
│                                  │
│ Headers:                         │
│ • Content-Type: application/json │
│ • Authorization: Bearer KEY      │
│                                  │
│ Body:                            │
│ • messages: conversation array   │
│ • context: "tasks"               │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Supabase Edge Function           │
│ • Calls OpenAI API               │
│ • Streams response               │
│ • Returns SSE (Server-Sent       │
│   Events) format                 │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Frontend Response Handling       │
│ • getReader() from response.body │
│ • TextDecoder for chunks         │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Parse SSE Format                 │
│ Lines starting with "data: "     │
│ • Skip comment lines (":...")    │
│ • Skip empty lines               │
│ • Parse JSON: choice.delta.      │
│   content                        │
│ • Check for "[DONE]" signal      │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Update Messages State            │
│ • If last message is assistant  │
│   → Update content progressively │
│ • Else                           │
│   → Create new assistant message │
│ (Streaming effect visible)       │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ UI Updates Continuously          │
│ • Shows typing effect            │
│ • Displays partial response      │
│ • Visible stream in real-time    │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Stream Complete ("[DONE"]        │
│ setIsLoading(false)              │
│ Full response visible            │
└──────────────────────────────────┘
```

---

## 5. Calendar Month Generation Logic

```
┌────────────────────────────────┐
│ Calendar Page Loads            │
│ currentDate = Today            │
│ selectedDate = Today           │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ Calculate Calendar Bounds      │
│                                │
│ monthStart =                   │
│ startOfMonth(currentDate)      │
│                                │
│ monthEnd =                     │
│ endOfMonth(currentDate)        │
│                                │
│ calendarStart =                │
│ startOfWeek(monthStart)        │
│ (includes previous month dates)│
│                                │
│ calendarEnd =                  │
│ endOfWeek(monthEnd)            │
│ (includes next month dates)    │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ Generate Array of All Days     │
│                                │
│ days = eachDayOfInterval({     │
│   start: calendarStart,        │
│   end: calendarEnd             │
│ })                             │
│                                │
│ Result: Array of 35-42 dates   │
│ (5-6 week rows)                │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ Render Calendar Grid (7x6)     │
│                                │
│ For each day:                  │
│ • Check isSameMonth()          │
│ • Check isToday()              │
│ • Check isSameDay(selected)    │
│ • Fetch events for day         │
│ • Count event types            │
│ • Apply conditional styling    │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ Day Cell Display               │
│                                │
│ Colors:                        │
│ • Current month: normal        │
│ • Other months: muted          │
│ • Today: ring highlight        │
│ • Selected: mode color bg      │
│                                │
│ Event Indicators:              │
│ • Classes: solid bar           │
│ • Tasks: amber dots            │
│ • Exams: red bar               │
│ • Event count badge            │
└────────────────────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ User Clicks Day                │
│ setSelectedDate(clickedDay)    │
│ Triggers event display update  │
└────────────────────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ Right Panel Updates            │
│ getEventsForDay(selectedDate)  │
│ → Filters events matching date │
│                                │
│ Conditional Display:           │
│ • Classes (Institution)        │
│ • Tasks from Teachers          │
│ • Exams                        │
│ • Study Sessions (Personal)    │
│ • Goals (Personal)             │
│ • Exam Week notices            │
└────────────────────────────────┘
```

---

## 6. React Component Lifecycle in Dashboard

```
┌─────────────────────────────────────┐
│ User Navigates to /dashboard        │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ ProtectedRoute Checks               │
│ • useAuth() called                  │
│ • If user exists → Allow            │
│ • If user null → Redirect to login  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Dashboard Component Mounts          │
│ • Creates component instance        │
│ • Initializes state hooks           │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Hooks Execute                       │
│                                     │
│ 1. useAuth()                        │
│    → Gets mode, role, user          │
│                                     │
│ 2. useState()                       │
│    → Initializes component state    │
│                                     │
│ 3. useEffect() (if any)             │
│    → Data fetching on mount         │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Render Logic                        │
│                                     │
│ 1. Background Particles (absolute)  │
│ 2. DashboardHeader                  │
│ 3. Sidebar                          │
│ 4. Main Content (mode-conditional)  │
│    a. Today's Schedule/Plan         │
│    b. Assigned Tasks/Courses        │
│    c. Calendar Snapshot             │
│    d. Daily Report/Goals            │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Components Mount in Order           │
│ • DashboardHeader                   │
│ • Sidebar                           │
│ • Each GlassCard                    │
│ • Child components (Items, Badges)  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ CSS Animations Trigger              │
│ • animate-fade-in (title)           │
│ • animate-slide-up (cards)          │
│ • Staggered delays per card         │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Page Interactive                    │
│ • User can click nav items          │
│ • User can interact with cards      │
│ • Hover effects apply               │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ User Navigates Away                 │
│ • Click different route             │
│ • React Router updates location     │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Dashboard Component Unmounts        │
│ • Cleanup effect hooks (if any)     │
│ • Remove event listeners            │
│ • Clear timers                      │
└─────────────────────────────────────┘
```

---

## 7. Tailwind Styling Architecture

```
┌─────────────────────────────────────────────┐
│ tailwind.config.ts                          │
├─────────────────────────────────────────────┤
│ Theme Configuration                         │
│                                             │
│ Colors:                                     │
│ • institution: { 50-950 scale }            │
│ • personal: { 50-950 scale }               │
│ • Custom CSS vars for theming               │
│                                             │
│ Extends:                                    │
│ • animation: { float, fadeIn, slideUp }   │
│ • typography: { prose utility classes }     │
│                                             │
│ Darkmode: class (not media query)           │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ index.css                                   │
├─────────────────────────────────────────────┤
│ @layer directives:                          │
│                                             │
│ @tailwind base                              │
│ • Resets browser defaults                   │
│ • Applies Tailwind base styles              │
│                                             │
│ @tailwind components                        │
│ • shadcn/ui component styles                │
│ • Custom component definitions              │
│                                             │
│ @tailwind utilities                         │
│ • All Tailwind utility classes              │
│                                             │
│ @layer utilities                            │
│ • Custom animation @keyframes               │
│   - animate-float                           │
│   - animate-fade-in                         │
│   - animate-slide-up                        │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ Component Usage                             │
├─────────────────────────────────────────────┤
│                                             │
│ <div className="                            │
│   min-h-screen                              │
│   bg-gradient-dark                          │
│   relative overflow-hidden                  │
│ ">                                          │
│   <!-- Layout -->                           │
│ </div>                                      │
│                                             │
│ <GlassCard hover>                           │
│   <!-- Glass morphism effect -->            │
│   <!-- Back blur + transparency -->         │
│ </GlassCard>                                │
│                                             │
│ <div className="                            │
│   animate-fade-in                           │
│   delay-100                                 │
│ ">                                          │
│   <!-- Staggered entrance animation -->     │
│ </div>                                      │
│                                             │
│ <div className={                            │
│   mode === "institution"                    │
│   ? "bg-institution text-institution"       │
│   : "bg-personal text-personal"             │
│ }>                                          │
│   <!-- Dynamic color theming -->            │
│ </div>                                      │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ PostCSS Processing                          │
├─────────────────────────────────────────────┤
│ postcss.config.js                           │
│ • autoprefixer: Vendor prefixes              │
│ • tailwindcss: Scans JSX for classes       │
│ • Combines into single CSS file             │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ Browser Rendering                           │
├─────────────────────────────────────────────┤
│ • Parsed CSS applied to DOM                 │
│ • Responsive breakpoints evaluated          │
│ • Dark mode classes activated               │
│ • Animations & transitions active           │
│ • User sees styled page                     │
└─────────────────────────────────────────────┘
```

---

## 8. Authentication Data Structure

```
┌──────────────────────────────────────┐
│ localStorage Key: "edulytics_auth"   │
├──────────────────────────────────────┤
│ Stored Value (JSON):                 │
│                                      │
│ {                                    │
│   "email": "student.xyz@academy.edu",│
│   "password": "DemoStudent123!",     │
│   "mode": "institution",             │
│   "role": "student"                  │
│ }                                    │
│                                      │
│ OR                                   │
│                                      │
│ {                                    │
│   "email": "demo.personal@...",      │
│   "password": "DemoPersonal123!",    │
│   "mode": "personal",                │
│   "role": "student"                  │
│ }                                    │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ AuthContext State                    │
├──────────────────────────────────────┤
│ {                                    │
│   user: DemoUser | null,             │
│   mode: "institution" | "personal",  │
│   role: "student" | "teacher" | ...  │
│   login: (email, pwd) → boolean,     │
│   logout: () → void                  │
│ }                                    │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Component Access via useAuth()       │
├──────────────────────────────────────┤
│ const { user, mode, role,            │
│         login, logout } = useAuth()  │
│                                      │
│ Usage:                               │
│ • Conditional rendering based on    │
│   user, mode, role                  │
│ • Call login() on form submission    │
│ • Call logout() on menu click        │
│ • Route protection in ProtectedRoute │
└──────────────────────────────────────┘
```

---

## 9. Supabase Integration Points

```
┌─────────────────────────────────────────────┐
│ Supabase Initialization                     │
│ supabase/client.ts                          │
├─────────────────────────────────────────────┤
│ const supabase = createClient(              │
│   VITE_SUPABASE_URL,                        │
│   VITE_SUPABASE_PUBLISHABLE_KEY,            │
│   {                                         │
│     auth: {                                 │
│       storage: localStorage,                │
│       persistSession: true,                 │
│       autoRefreshToken: true                │
│     }                                       │
│   }                                         │
│ )                                           │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ Database Tables Used                        │
├─────────────────────────────────────────────┤
│                                             │
│ tasks table:                                │
│ • id: UUID (primary key)                    │
│ • title: string                             │
│ • description: text (optional)              │
│ • status: enum (pending, in_progress, ...) │
│ • priority: enum (low, medium, high)       │
│ • due_date: timestamp                       │
│ • course: string (optional)                 │
│ • created_at: timestamp                     │
│ • updated_at: timestamp                     │
│                                             │
│ [Other tables may exist but not yet used]   │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ Query Operations                            │
├─────────────────────────────────────────────┤
│                                             │
│ Tasks Page (Tasks.tsx):                     │
│ SELECT * FROM tasks                         │
│ ORDER BY created_at DESC                    │
│                                             │
│ Timetable Page (Timetable.tsx):             │
│ SELECT * FROM tasks                         │
│ WHERE due_date IS NOT NULL                  │
│ ORDER BY due_date ASC                       │
│                                             │
│ Reports Page (Reports.tsx):                 │
│ SELECT * FROM tasks                         │
│ ORDER BY created_at DESC                    │
│ (Client-side filtering by status)           │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ Edge Functions                              │
├─────────────────────────────────────────────┤
│                                             │
│ /functions/v1/chat-with-ai                  │
│ • Triggered by Tasks page                   │
│ • Receives: messages[], context string      │
│ • Calls: OpenAI API with streaming          │
│ • Returns: Server-Sent Events (SSE)         │
│ • Frontend parses stream and displays       │
│                                             │
│ Implementation: supabase/functions/         │
│                 chat-with-ai/index.ts       │
└─────────────────────────────────────────────┘
```

---

## 10. Component Prop Drilling & State Flow

```
App.tsx (Auth Provider)
│
├─ useAuth() provided to all children
│
└─ Routes
   │
   └─ Protected Routes
      │
      ├─ DashboardHeader
      │  └─ Uses: useAuth() for user/logout
      │  └─ Uses: useNavigate() for nav
      │
      ├─ Sidebar
      │  └─ Props: mode, userRole
      │  └─ Children: NavLink components
      │
      └─ Page Component (Dashboard/Calendar/etc)
         │
         ├─ useState: Local page state
         ├─ useAuth(): Mode/Role context
         │
         └─ Child Components
            │
            ├─ GlassCard
            │  ├─ Props: hover, className
            │  └─ Children: Content specific
            │
            ├─ ScheduleItem / TaskItem / etc
            │  ├─ Props: data from parent
            │  ├─ Display: rendered content
            │  └─ Events: onClick, onChange
            │
            └─ Progress / Badge / Buttons
               └─ Props: styled utilities
```

---

**Diagrams compiled for Edulytics project**
**Generated: December 1, 2025**
