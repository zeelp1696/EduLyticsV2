import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type DashboardMode = "institution" | "personal";

interface DashboardProps {
  forcedMode?: DashboardMode;
}

const Dashboard: React.FC<DashboardProps> = ({ forcedMode }) => {
  // Get mode and role from authenticated user
  const { mode, role } = useAuth();
  const userRole = role || "student";

  // Decide dashboard mode:
  // 1. If a mode is forced by the route, use it
  // 2. Else, use AuthContext mode (for institution demo login)
  // 3. Else, infer from stored user (for personal login)
  // 4. Fallback to "institution"
  let dashboardMode: DashboardMode = "institution";

  if (forcedMode === "institution" || forcedMode === "personal") {
    dashboardMode = forcedMode;
  } else if (mode === "institution" || mode === "personal") {
    dashboardMode = mode;
  } else if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("edulytics_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.account_type === "personal") {
          dashboardMode = "personal";
        }
      }
    } catch {
      // ignore JSON errors, keep default
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-institution/10 rounded-full blur-3xl top-20 -left-20 animate-float" />
        <div className="absolute w-96 h-96 bg-personal/10 rounded-full blur-3xl bottom-20 -right-20 animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <DashboardHeader mode={dashboardMode} />

      <div className="flex relative z-10">
        <Sidebar mode={dashboardMode} userRole={userRole} />

        <main className="flex-1 container mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">
              {dashboardMode === "institution" ? "Institution Overview" : "Your Learning Space"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {dashboardMode === "institution" ? "Track your classes and tasks" : "Manage your learning journey"}
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Schedule / Today's Plan */}
              <GlassCard hover className="animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-xl ${
                    dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"
                  }`}>
                    <Clock className={`w-5 h-5 ${
                      dashboardMode === "institution" ? "text-institution" : "text-personal"
                    }`} />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {dashboardMode === "institution" ? "Today's Schedule" : "Today's Plan"}
                  </h2>
                </div>

                <div className="space-y-3">
                  {dashboardMode === "institution" ? (
                    <>
                      <ScheduleItem time="09:00-10:00" subject="Mathematics" room="Room A-102" type="Class" mode={dashboardMode} />
                      <ScheduleItem time="10:15-11:15" subject="Physics" room="Room B-204" type="Class" mode={dashboardMode} />
                      <ScheduleItem time="11:15-11:30" subject="Break" room="-" type="Break" mode={dashboardMode} />
                      <ScheduleItem time="11:30-12:30" subject="Chemistry" room="Lab C-301" type="Class" mode={dashboardMode} />
                      <ScheduleItem time="14:00-16:00" subject="Final Exam" room="Hall A" type="Exam" mode={dashboardMode} />
                    </>
                  ) : (
                    <>
                      <StudyBlock task="Python – Units 1-3" duration="45 min" mode={dashboardMode} />
                      <StudyBlock task="Chemistry – Revise Chapter 4" duration="30 min" mode={dashboardMode} />
                      <StudyBlock task="Literature – Read Pages 45-78" duration="60 min" mode={dashboardMode} />
                      <StudyBlock task="Mathematics – Practice Problems" duration="40 min" mode={dashboardMode} />
                    </>
                  )}
                </div>
              </GlassCard>

              {/* Tasks / Courses */}
              <GlassCard hover className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"
                    }`}>
                      <CheckCircle2 className={`w-5 h-5 ${
                        dashboardMode === "institution" ? "text-institution" : "text-personal"
                      }`} />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {dashboardMode === "institution" ? "Assigned Tasks" : "My Courses"}
                    </h2>
                  </div>
                  {dashboardMode === "institution" && (
                    <Button variant="outline" size="sm">View All Tasks</Button>
                  )}
                </div>

                {dashboardMode === "institution" ? (
                  <div className="space-y-3">
                    <TaskItem task="Complete Lab Report" course="Chemistry" due="Tomorrow" status="Assigned" mode={dashboardMode} />
                    <TaskItem task="Chapter 5 Questions" course="Mathematics" due="In 3 days" status="Submitted" mode={dashboardMode} />
                    <TaskItem task="Essay on Photosynthesis" course="Biology" due="Today" status="Verified" mode={dashboardMode} />
                    <TaskItem task="Project Presentation" course="Physics" due="Yesterday" status="Overdue" mode={dashboardMode} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <CourseProgress course="Python Programming" progress={75} ecd="Dec 25, 2025" behind={0} mode={dashboardMode} />
                    <CourseProgress course="Chemistry Basics" progress={45} ecd="Jan 15, 2026" behind={3} mode={dashboardMode} />
                    <CourseProgress course="Literature Studies" progress={90} ecd="Dec 10, 2025" behind={0} mode={dashboardMode} />
                    <CourseProgress course="Advanced Mathematics" progress={60} ecd="Feb 1, 2026" behind={0} mode={dashboardMode} />
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Calendar Snapshot */}
              <GlassCard hover className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${
                    dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"
                  }`}>
                    <Calendar className={`w-5 h-5 ${
                      dashboardMode === "institution" ? "text-institution" : "text-personal"
                    }`} />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">This Week</h2>
                </div>

                <div className="space-y-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                    <div key={day} className="flex items-center justify-between p-2 rounded-lg hover:bg-card/50 transition-colors">
                      <span className="text-sm font-medium text-muted-foreground">{day} {15 + i}</span>
                      <div className="flex gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          dashboardMode === "institution" ? "bg-institution" : "bg-personal"
                        }`} title="Class/Study" />
                        <div className="w-2 h-2 rounded-full bg-amber-500" title="Task Due" />
                        {dashboardMode === "institution" && i < 3 && (
                          <div className="w-2 h-2 rounded-full bg-green-500" title="Present" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Daily Report / Goals */}
              <GlassCard hover className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${
                    dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"
                  }`}>
                    <TrendingUp className={`w-5 h-5 ${
                      dashboardMode === "institution" ? "text-institution" : "text-personal"
                    }`} />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {dashboardMode === "institution" ? "Daily Report" : "Goals & Focus"}
                  </h2>
                </div>

                {dashboardMode === "institution" ? (
                  <div className="space-y-4">
                    <MetricItem label="Tasks Completed" value="4 / 6" progress={67} mode={dashboardMode} />
                    <MetricItem label="Timetable Utilization" value="85%" progress={85} mode={dashboardMode} />
                    <MetricItem label="On-time Submissions" value="92%" progress={92} mode={dashboardMode} />
                    <p className="text-xs text-muted-foreground mt-4 italic">
                      Task is only counted as completed after teacher verification.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2 border-b border-border/50 pb-2">
                      <button className="px-3 py-1 text-sm font-medium text-personal bg-personal/20 rounded-lg">Daily</button>
                      <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground">Weekly</button>
                      <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground">Monthly</button>
                    </div>
                    <MetricItem label="Study Hours" value="5 / 6" progress={83} mode={dashboardMode} />
                    <MetricItem label="Tasks Completed" value="8 / 10" progress={80} mode={dashboardMode} />
                    <div className="mt-4 p-3 bg-personal/10 rounded-lg border border-personal/20">
                      <p className="text-sm text-personal font-medium">You're on track! 🎯</p>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper Components
const ScheduleItem = ({ time, subject, room, type, mode }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-card/30 hover:bg-card/50 transition-all">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{subject}</span>
        <Badge variant={type === "Exam" ? "destructive" : "secondary"} className="text-xs">
          {type}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{time} · {room}</p>
    </div>
  </div>
);

const StudyBlock = ({ task, duration, mode }: any) => {
  const [completed, setCompleted] = useState(false);
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl bg-card/30 hover:bg-card/50 transition-all ${
      completed ? "opacity-60" : ""
    }`}>
      <Checkbox
        checked={completed}
        onCheckedChange={(checked) => setCompleted(checked === true)}
        className={mode === "personal" ? "border-personal data-[state=checked]:bg-personal" : ""}
      />
      <div className="flex-1">
        <p className={`text-sm font-medium ${completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task}
        </p>
        <p className="text-xs text-muted-foreground">{duration}</p>
      </div>
    </div>
  );
};

const TaskItem = ({ task, course, due, status, mode }: any) => {
  const statusColors = {
    Assigned: "bg-muted text-muted-foreground",
    Submitted: "bg-amber-500/20 text-amber-500",
    Verified: `${mode === "institution" ? "bg-institution/20 text-institution" : "bg-personal/20 text-personal"}`,
    Overdue: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-card/30">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{task}</p>
        <p className="text-xs text-muted-foreground">{course} · Due {due}</p>
      </div>
      <Badge className={statusColors[status as keyof typeof statusColors]}>{status}</Badge>
    </div>
  );
};

const CourseProgress = ({ course, progress, ecd, behind, mode }: any) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-foreground">{course}</p>
      {behind > 0 && (
        <Badge variant="outline" className="text-amber-500 border-amber-500">
          {behind} days behind
        </Badge>
      )}
    </div>
    <Progress value={progress} className={mode === "personal" ? "[&>div]:bg-personal" : ""} />
    <p className="text-xs text-muted-foreground">ECD: {ecd} · {progress}%</p>
  </div>
);

const MetricItem = ({ label, value, progress, mode }: any) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
    <Progress value={progress} className={mode === "personal" ? "[&>div]:bg-personal" : ""} />
  </div>
);

export default Dashboard;
