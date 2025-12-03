import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { useAuth } from "@/context/AuthContext";

const Calendar = () => {
  // Get mode and role from authenticated user - fixed based on login
  const { mode, role } = useAuth();
  const userRole = role || "student";
  const dashboardMode = mode || "institution";
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  // Mock events data
  const events = {
    institution: [
      { date: new Date(2025, 10, 18), type: "class", title: "Mathematics", time: "09:00-10:00", room: "A-102" },
      { date: new Date(2025, 10, 18), type: "class", title: "Physics", time: "10:15-11:15", room: "B-204" },
      { date: new Date(2025, 10, 18), type: "task", title: "Lab Report", course: "Chemistry", status: "Assigned" },
      { date: new Date(2025, 10, 19), type: "class", title: "Chemistry", time: "11:30-12:30", room: "C-301" },
      { date: new Date(2025, 10, 19), type: "task", title: "Essay", course: "Biology", status: "Submitted" },
      { date: new Date(2025, 10, 20), type: "exam", title: "Mathematics Final", time: "14:00-16:00", room: "Hall A" },
      { date: new Date(2025, 10, 21), type: "class", title: "Literature", time: "09:00-10:00", room: "D-101" },
      { date: new Date(2025, 10, 22), type: "task", title: "Chapter Review", course: "Physics", status: "Verified" },
    ],
    personal: [
      { date: new Date(2025, 10, 18), type: "study", title: "Python – Units 1-3", duration: "45 min" },
      { date: new Date(2025, 10, 18), type: "study", title: "Chemistry Review", duration: "30 min" },
      { date: new Date(2025, 10, 19), type: "study", title: "Literature Reading", duration: "60 min" },
      { date: new Date(2025, 10, 19), type: "goal", title: "Complete 5 practice problems" },
      { date: new Date(2025, 10, 20), type: "study", title: "Mathematics Practice", duration: "40 min" },
      { date: new Date(2025, 10, 21), type: "exam-week", title: "Exam Week – AI tasks paused", startDate: new Date(2025, 10, 21), endDate: new Date(2025, 10, 25) },
      { date: new Date(2025, 10, 22), type: "goal", title: "Weekly goal checkpoint" },
    ]
  };

  const currentEvents = dashboardMode === "institution" ? events.institution : events.personal;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return currentEvents.filter(event => isSameDay(event.date, day));
  };

  const selectedDayEvents = getEventsForDay(selectedDate);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

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
              {dashboardMode === "institution" ? "Unified Calendar" : "Your Study Calendar"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {dashboardMode === "institution"
                ? "Classes, tasks, and attendance in one view" 
                : "Manage your study schedule and track progress"}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Calendar Controls */}
              <GlassCard className="animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrevMonth}
                      className="hover:bg-card/50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-xl font-semibold text-foreground min-w-[200px] text-center">
                      {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNextMonth}
                      className="hover:bg-card/50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("month")}
                      className={viewMode === "month" ? (dashboardMode === "institution" ? "bg-institution hover:bg-institution/90" : "bg-personal hover:bg-personal/90") : ""}
                    >
                      Month
                    </Button>
                    <Button
                      variant={viewMode === "week" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("week")}
                      className={viewMode === "week" ? (dashboardMode === "institution" ? "bg-institution hover:bg-institution/90" : "bg-personal hover:bg-personal/90") : ""}
                    >
                      Week
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="space-y-4">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day, idx) => {
                      const dayEvents = getEventsForDay(day);
                      const isCurrentMonth = isSameMonth(day, currentDate);
                      const isTodayDate = isToday(day);
                      const isSelected = isSameDay(day, selectedDate);
                      const hasClasses = dayEvents.some(e => e.type === "class");
                      const hasTasks = dayEvents.some(e => e.type === "task" || e.type === "study");
                      const hasExam = dayEvents.some(e => e.type === "exam" || e.type === "exam-week");

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDate(day)}
                          className={`
                            min-h-[100px] p-2 rounded-xl border transition-all relative
                            ${isCurrentMonth ? "bg-card/30 border-border/50" : "bg-card/10 border-border/20"}
                            ${isTodayDate ? (dashboardMode === "institution" ? "ring-2 ring-institution shadow-lg shadow-institution/20" : "ring-2 ring-personal shadow-lg shadow-personal/20") : ""}
                            ${isSelected ? (dashboardMode === "institution" ? "bg-institution/20 border-institution" : "bg-personal/20 border-personal") : "hover:bg-card/50"}
                          `}
                        >
                          <div className="text-left">
                            <span className={`text-sm font-medium ${
                              isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                            } ${isTodayDate ? (dashboardMode === "institution" ? "text-institution" : "text-personal") : ""}`}>
                              {format(day, "d")}
                            </span>
                          </div>

                          {/* Event Markers */}
                          <div className="mt-2 space-y-1">
                            {hasClasses && (
                              <div className={`h-1 rounded-full ${dashboardMode === "institution" ? "bg-institution" : "bg-personal"}`} />
                            )}
                            {hasTasks && (
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                              </div>
                            )}
                            {hasExam && (
                              <div className="h-2 rounded-full bg-destructive" />
                            )}
                          </div>

                          {/* Event count badge */}
                          {dayEvents.length > 0 && (
                            <div className="absolute bottom-1 right-1 text-xs text-muted-foreground">
                              {dayEvents.length}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className={`h-1 w-8 rounded-full ${dashboardMode === "institution" ? "bg-institution" : "bg-personal"}`} />
                    <span>{dashboardMode === "institution" ? "Classes" : "Study Sessions"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-8 rounded-full bg-destructive" />
                    <span>Exams</span>
                  </div>
                  {dashboardMode === "institution" && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Present</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span>Absent</span>
                      </div>
                    </>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Details Panel */}
            <div className="space-y-6">
              <GlassCard hover className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${
                    dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"
                  }`}>
                    <CalendarIcon className={`w-5 h-5 ${
                      dashboardMode === "institution" ? "text-institution" : "text-personal"
                    }`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {format(selectedDate, "MMMM d, yyyy")}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE")}
                    </p>
                  </div>
                </div>

                {selectedDayEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No events scheduled for this day
                  </p>
                ) : (
                  <div className="space-y-4">
                    {dashboardMode === "institution" ? (
                      <>
                        {/* Classes Section */}
                        {selectedDayEvents.some(e => e.type === "class") && (
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-2">Classes</h3>
                            <div className="space-y-2">
                              {selectedDayEvents
                                .filter(e => e.type === "class")
                                .map((event: any, idx) => (
                                  <div key={idx} className="p-3 rounded-lg bg-card/30 border border-border/50">
                                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      <span>{event.time}</span>
                                      <MapPin className="w-3 h-3 ml-2" />
                                      <span>{event.room}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Tasks Section */}
                        {selectedDayEvents.some(e => e.type === "task") && (
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-2">Tasks from Teachers</h3>
                            <div className="space-y-2">
                              {selectedDayEvents
                                .filter(e => e.type === "task")
                                .map((event: any, idx) => (
                                  <div key={idx} className="p-3 rounded-lg bg-card/30 border border-border/50">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                                      <TaskStatusBadge status={event.status} mode={dashboardMode} />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{event.course}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Exams Section */}
                        {selectedDayEvents.some(e => e.type === "exam") && (
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-2">Exams</h3>
                            <div className="space-y-2">
                              {selectedDayEvents
                                .filter(e => e.type === "exam")
                                .map((event: any, idx) => (
                                  <div key={idx} className="p-3 rounded-lg bg-destructive/20 border border-destructive/50">
                                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      <span>{event.time}</span>
                                      <MapPin className="w-3 h-3 ml-2" />
                                      <span>{event.room}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Today's Plan (Personal Mode) */}
                        {selectedDayEvents.some(e => e.type === "study") && (
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-2">Today's Plan</h3>
                            <div className="space-y-2">
                              {selectedDayEvents
                                .filter(e => e.type === "study")
                                .map((event: any, idx) => (
                                  <StudyTaskItem key={idx} task={event.title} duration={event.duration} mode={dashboardMode} />
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Goals */}
                        {selectedDayEvents.some(e => e.type === "goal") && (
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-2">Goals</h3>
                            <div className="space-y-2">
                              {selectedDayEvents
                                .filter(e => e.type === "goal")
                                .map((event, idx) => (
                                  <div key={idx} className="p-3 rounded-lg bg-personal/20 border border-personal/50">
                                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Exam Week */}
                        {selectedDayEvents.some(e => e.type === "exam-week") && (
                          <div className="p-4 rounded-lg bg-destructive/20 border border-destructive/50">
                            <p className="text-sm font-medium text-foreground">📚 Exam Week</p>
                            <p className="text-xs text-muted-foreground mt-1">AI task scheduling paused</p>
                          </div>
                        )}

                        {/* Catch-Up Status */}
                        <div className="p-4 rounded-lg bg-card/30 border border-border/50">
                          <h3 className="text-sm font-semibold text-foreground mb-2">Progress Status</h3>
                          <p className="text-sm text-personal mb-3">✓ You're on track</p>
                          <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              Distribute missed work
                            </Button>
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              Extend deadline by 3 days
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
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
const TaskStatusBadge = ({ status, mode }: { status?: string; mode: string }) => {
  const statusColors = {
    Assigned: "bg-muted text-muted-foreground",
    Submitted: "bg-amber-500/20 text-amber-500",
    Verified: mode === "institution" ? "bg-institution/20 text-institution" : "bg-personal/20 text-personal",
    "Needs Revision": "bg-destructive/20 text-destructive",
    Overdue: "bg-destructive/20 text-destructive",
  };

  return (
    <Badge className={statusColors[status as keyof typeof statusColors] || "bg-muted"}>
      {status}
    </Badge>
  );
};

const StudyTaskItem = ({ task, duration, mode }: { task: string; duration: string; mode: string }) => {
  const [completed, setCompleted] = useState(false);

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-border/50 transition-all ${
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

export default Calendar;
