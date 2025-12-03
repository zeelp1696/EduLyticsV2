# Edulytics - Quick Reference Guide

## 🗂️ File Organization Quick Reference

### Core Application Files
```
src/
├── main.tsx              → App entry point (React root)
├── App.tsx               → Router setup + providers
├── index.css             → Tailwind + custom animations
├── App.css               → Additional app styles
└── vite-env.d.ts         → Vite type definitions
```

### Pages (Feature Implementation)
```
src/pages/
├── Landing.tsx           → Home page (public)
├── InstitutionLogin.tsx  → Institution login (public)
├── PersonalLogin.tsx     → Personal login (public)
├── PersonalSignup.tsx    → Signup page (public)
├── Dashboard.tsx         → Main dashboard (protected)
├── Calendar.tsx          → Calendar view (protected)
├── Tasks.tsx             → Task management + AI chat (protected)
├── Timetable.tsx         → Weekly schedule grid (protected)
├── Reports.tsx           → Analytics & metrics (protected)
├── Profile.tsx           → User profile (protected)
├── Settings.tsx          → Preferences (protected)
└── NotFound.tsx          → 404 page
```

### Components (UI Building Blocks)
```
src/components/
├── DashboardHeader.tsx   → Top navbar (all dashboard pages)
├── Sidebar.tsx           → Left navigation (all dashboard pages)
├── GlassCard.tsx         → Main card container (glass effect)
├── NavLink.tsx           → Styled nav link
├── ProgressBar.tsx       → Progress visualization
├── StatCard.tsx          → Stat display (Landing)
├── FeatureCard.tsx       → Feature showcase (Landing)
├── StepCard.tsx          → Process step (Landing)
├── SecurityCard.tsx      → Security badge (Landing)
├── ModeToggle.tsx        → Institution/Personal toggle
├── Footer.tsx            → Page footer (Landing)
│
└── ui/                   → shadcn/ui Components (30+ files)
    ├── button.tsx        → Button component
    ├── card.tsx          → Card container
    ├── dialog.tsx        → Modal dialog
    ├── dropdown-menu.tsx → Dropdown menu
    ├── input.tsx         → Text input
    ├── progress.tsx      → Progress bar
    ├── badge.tsx         → Badge label
    ├── checkbox.tsx      → Checkbox input
    ├── switch.tsx        → Toggle switch
    ├── avatar.tsx        → User avatar
    ├── tabs.tsx          → Tab navigation
    ├── table.tsx         → Table display
    ├── toast.tsx         → Toast notifications
    ├── toaster.tsx       → Toast container
    ├── use-toast.ts      → Toast hook
    └── [20+ more UI components]
```

### Context & Hooks
```
src/context/
├── AuthContext.tsx       → Global auth state (useAuth hook)

src/hooks/
├── use-toast.ts          → Toast notification hook
└── use-mobile.tsx        → Mobile detection hook
```

### Routes & Protection
```
src/routes/
└── ProtectedRoute.tsx    → Route guard wrapper
```

### Integration & Utils
```
src/integrations/
└── supabase/
    ├── client.ts         → Supabase client init
    └── types.ts          → Database types (auto-generated)

src/lib/
└── utils.ts              → cn() function (classname merge)
```

### Configuration Files
```
Root/
├── package.json          → Dependencies & scripts
├── tsconfig.json         → TypeScript config
├── tsconfig.app.json     → App-specific TS config
├── tsconfig.node.json    → Node TS config
├── vite.config.ts        → Vite build config
├── tailwind.config.ts    → Tailwind theme config
├── postcss.config.js     → PostCSS plugins
├── eslint.config.js      → Linting rules
├── components.json       → shadcn/ui config
└── index.html            → HTML template
```

---

## 🔍 Where to Find Specific Logic

### Authentication Logic
**File**: `src/context/AuthContext.tsx`
```
- login(email, password)     → Validates demo users
- logout()                   → Clears session
- useAuth() hook             → Access auth data
- localStorage persistence   → 'edulytics_auth' key
```

**File**: `src/authConfig.ts`
```
- DEMO_USERS array           → Credentials for login
- UserMode type              → 'institution' | 'personal'
- UserRole type              → 'student' | 'teacher' | 'admin'
```

### Dashboard Display Logic
**File**: `src/pages/Dashboard.tsx`
```
- Mode-conditional rendering → Institution vs Personal views
- useAuth() for mode/role    → Determines what shows
- ScheduleItem component     → Displays classes
- StudyBlock component       → Displays study tasks
- TaskItem component         → Displays assignments
- CourseProgress component   → Progress bars
- MetricItem component       → Statistics
```

### Task Management Logic
**File**: `src/pages/Tasks.tsx`
```
- fetchTasks()               → SELECT from Supabase tasks table
- sendMessage()              → Streams to chat-with-ai function
- Message parsing            → SSE format parsing
- getStatusColor()           → Status badge styling
- getPriorityColor()         → Priority badge styling
```

### Calendar Logic
**File**: `src/pages/Calendar.tsx`
```
- Month navigation           → addMonths/subMonths from date-fns
- Calendar generation        → eachDayOfInterval
- getEventsForDay()          → Filter events by date
- Date checking              → isSameDay, isToday, isSameMonth
- Event indicators           → Bar/dot colors by type
```

### Timetable Grid Logic
**File**: `src/pages/Timetable.tsx`
```
- fetchTasks()               → SELECT with due_date NOT NULL
- getTasksForSlot()          → Filter by day & hour
- timeSlots array            → 8 AM - 7 PM (12 slots)
- weekDays calculation       → 7 consecutive dates
- Grid rendering             → 8 columns (time + 7 days)
```

### Analytics Logic
**File**: `src/pages/Reports.tsx`
```
- fetchTasks()               → Get all tasks
- Status filtering           → Count by status enum
- Calculation:
  • completionRate = (completed/total) * 100
  • activeRate = ((completed+inProgress)/total) * 100
- Stat cards                 → 4-card overview grid
```

### UI Theming
**Files**: `tailwind.config.ts`, `src/index.css`, `src/App.css`
```
- institution color          → Blue (#3B82F6)
- personal color             → Purple (#A855F7)
- Conditional classes        → ? "bg-institution" : "bg-personal"
- Animations:
  • animate-float            → Background particles
  • animate-fade-in          → Page entrance
  • animate-slide-up         → Card entrance
```

---

## 📊 Data Flow Summary

### Simple Flow (No Backend)
```
Landing → Mode Toggle → 
Color & Content Changes
```

### Authentication Flow
```
Login Form → 
AuthContext.login() → 
localStorage.setItem() → 
Route Navigation → 
ProtectedRoute Check
```

### Full Data Flow (Backend)
```
Tasks Page Mount →
useEffect runs →
fetchTasks() → 
supabase.from('tasks').select() →
Supabase Returns Data →
setTasks(data) →
UI Renders Task List →
User Sends Message →
sendMessage() →
Fetch to Edge Function →
Stream Response (SSE) →
Parse & Accumulate Chunks →
setMessages() Updates UI
```

---

## 🎨 Styling Quick Reference

### Mode-Based Colors
```typescript
// Institution Mode
dashboardMode === "institution" ? "bg-institution" : "bg-personal"
dashboardMode === "institution" ? "text-institution" : "text-personal"
dashboardMode === "institution" ? "border-institution" : "border-personal"

// Active Route Styling
mode === "institution" 
  ? "bg-institution/20 border-l-4 border-institution" 
  : "bg-personal/20 border-l-4 border-personal"
```

### Common Class Patterns
```typescript
// Glass Card
"bg-card/30 backdrop-blur-md border border-border/50 rounded-xl"

// Hover Effects
"hover:bg-card/50 transition-all hover:shadow-lg"

// Icon Containers
"p-3 rounded-xl bg-institution/20"  // Or personal/20

// Badges
"bg-green-500/20 text-green-500"    // Success
"bg-amber-500/20 text-amber-500"    // Warning
"bg-destructive/20 text-destructive" // Error
"bg-blue-500/20 text-blue-500"      // Info
```

### Responsive Grid
```typescript
// 2-column on tablet, 3+ on desktop
"grid md:grid-cols-2 lg:grid-cols-3 gap-6"

// Full width on mobile, split on desktop
"grid lg:grid-cols-3 gap-6"  // 1 col mobile, 3 col desktop

// Sidebar + Main content
"flex relative z-10"  // Main container
"w-64 border-r"       // Sidebar width
"flex-1"              // Main content flex
```

### Animation Application
```tsx
// Fade in on load
className="animate-fade-in"

// Slide up with delay
className="animate-slide-up"
style={{ animationDelay: "0.1s" }}

// Floating particles
className="animate-float"
style={{ animationDelay: "1s" }}

// Pulsing notification
className="animate-pulse"
```

---

## 🚀 Common Development Tasks

### Add a New Route
1. Create page file: `src/pages/NewPage.tsx`
2. Add to `App.tsx` routes:
```tsx
<Route path="/newpage" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />
```
3. Add to Sidebar navigation in `src/components/Sidebar.tsx`

### Add a New Component
1. Create file: `src/components/MyComponent.tsx`
2. Define props interface
3. Use `useAuth()` if mode/role needed
4. Import and use in pages

### Fetch Data from Supabase
```typescript
const fetchData = async () => {
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(error);
    toast({ variant: "destructive", description: "Error" });
  } else {
    setData(data);
  }
};

useEffect(() => {
  fetchData();
}, []);
```

### Style Based on Mode
```tsx
<div className={
  dashboardMode === "institution" 
    ? "bg-institution text-institution" 
    : "bg-personal text-personal"
}>
  Content
</div>
```

### Show Toast Message
```typescript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Success",
  description: "Operation completed",
  variant: "default" // or "destructive"
});
```

### Create Animated Card
```tsx
<GlassCard hover className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
  <div className="flex items-center gap-3">
    <IconComponent className="w-5 h-5 text-mode-color" />
    <h2>Title</h2>
  </div>
</GlassCard>
```

---

## 📱 Key Responsive Breakpoints

Tailwind breakpoints used:
- `sm`: 640px
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (wide)

Common patterns:
```tsx
// Single column on mobile, multiple on desktop
className="grid md:grid-cols-2 lg:grid-cols-3"

// Hide on mobile, show on desktop
className="hidden md:block"

// Full width on mobile, constrained on desktop
className="container mx-auto px-4"

// Responsive padding
className="px-4 md:px-6 lg:px-8"
```

---

## 🔐 Environment Variables Needed

```bash
# .env.local (create this file)

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key
```

Available in:
- `src/integrations/supabase/client.ts`
- `src/pages/Tasks.tsx` (for Edge Function calls)

---

## 🧪 Testing Demo Users

### Institution Mode
- **Email**: `student.xyz@academy.edu`
- **Password**: `DemoStudent123!`
- **Mode**: Institution
- **Role**: Student

### Personal Mode
- **Email**: `demo.personal@edulytics.app`
- **Password**: `DemoPersonal123!`
- **Mode**: Personal
- **Role**: Student

### Teacher Account (for future admin features)
- **Email**: `teacher.xyz@academy.edu`
- **Password**: `DemoTeacher123!`
- **Mode**: Institution
- **Role**: Teacher

---

## 🐛 Common Debugging

### User Not Persisting After Refresh
Check `localStorage`:
```javascript
// In browser console
localStorage.getItem('edulytics_auth')
// Should return JSON object with user data
```

### Supabase Queries Not Working
Verify environment variables:
```javascript
// In browser console
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
// Should both have values
```

### Routes Not Showing
1. Check `App.tsx` for route definition
2. Check page file exists in `src/pages/`
3. Verify imports are correct
4. Check ProtectedRoute wrapping for auth routes

### Styling Not Applied
1. Check class name spelling
2. Verify Tailwind config includes the class
3. Clear build cache: `rm -rf .next dist`
4. Check for conflicting Tailwind classes

---

## 📚 Additional Resources

### File Statistics
- **Total Pages**: 12 (including 404)
- **Total Components**: 40+ (UI library + custom)
- **Total Hooks**: 3+ (useAuth, useToast, useMobile)
- **Lines of Code**: ~3000+ (frontend only)

### Package Versions
- React: 18.3.1
- TypeScript: 5.8.3
- Tailwind: 3.4.17
- Vite: 5.4.19
- Supabase: 2.84.0

### Documentation Structure
This project includes:
1. `PROJECT_DOCUMENTATION.md` - Comprehensive guide (this file's source)
2. `ARCHITECTURE_DIAGRAMS.md` - Visual architecture flows
3. `QUICK_REFERENCE.md` - This quick lookup guide

---

## 🎯 Key Takeaways

**The Edulytics platform is structured as:**

1. **Landing Page** - Mode selection and feature marketing
2. **Dual Authentication System** - Institution vs Personal flows
3. **Unified Dashboard** - Central hub with mode-specific views
4. **Supporting Pages** - Calendar, Tasks, Timetable, Reports, Profile, Settings
5. **AI Integration** - Chat assistant via Supabase Edge Functions
6. **Responsive Design** - Mobile-first with Tailwind CSS
7. **Component Library** - 40+ reusable shadcn/ui components
8. **State Management** - Context for auth, React Query for server state
9. **Styling System** - Mode-based colors (Institution Blue vs Personal Purple)
10. **Database Ready** - Supabase integration for tasks and chat

**All logic is clearly separated by feature/page with consistent patterns throughout.**

---

**Quick Reference compiled for Edulytics**
**Last Updated: December 1, 2025**
