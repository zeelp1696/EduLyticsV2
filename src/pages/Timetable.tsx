import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

const Timetable = () => {
  const { mode, role } = useAuth();
  const userRole = role || "student";
  const dashboardMode = mode || "institution";
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .not("due_date", "is", null)
      .order("due_date", { ascending: true });

    setTasks(data || []);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const getTasksForSlot = (day: Date, hour: number) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return isSameDay(taskDate, day) && taskDate.getHours() === hour;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-500 border-green-500/50";
      case "in_progress": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "overdue": return "bg-destructive/20 text-destructive border-destructive/50";
      default: return "bg-muted text-muted-foreground border-border/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-institution/10 rounded-full blur-3xl top-20 -left-20 animate-float" />
        <div className="absolute w-96 h-96 bg-personal/10 rounded-full blur-3xl bottom-20 -right-20 animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <DashboardHeader mode={dashboardMode} />

      <div className="flex relative z-10">
        <Sidebar mode={dashboardMode} userRole={userRole} />

        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">Weekly Timetable</h1>
            <p className="text-muted-foreground mt-1">
              {format(currentWeek, "MMMM d")} - {format(addDays(currentWeek, 6), "MMMM d, yyyy")}
            </p>
          </div>

          <GlassCard className="animate-slide-up overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header Row */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="text-sm font-medium text-muted-foreground">Time</div>
                {weekDays.map((day, i) => (
                  <div key={i} className="text-center">
                    <div className="text-sm font-semibold text-foreground">{format(day, "EEE")}</div>
                    <div className={`text-xs ${isSameDay(day, new Date()) ? (dashboardMode === "institution" ? "text-institution" : "text-personal") : "text-muted-foreground"}`}>
                      {format(day, "d")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Grid */}
              <div className="space-y-2">
                {timeSlots.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 gap-2">
                    <div className="text-xs text-muted-foreground py-2">
                      {format(new Date().setHours(hour, 0), "h:mm a")}
                    </div>
                    {weekDays.map((day, dayIndex) => {
                      const slotTasks = getTasksForSlot(day, hour);
                      return (
                        <div
                          key={dayIndex}
                          className={`min-h-[60px] rounded-lg border transition-all ${
                            isSameDay(day, new Date())
                              ? dashboardMode === "institution"
                                ? "bg-institution/5 border-institution/20"
                                : "bg-personal/5 border-personal/20"
                              : "bg-card/20 border-border/30"
                          } hover:bg-card/40 p-1`}
                        >
                          {slotTasks.length > 0 ? (
                            <div className="space-y-1">
                              {slotTasks.map((task) => (
                                <div
                                  key={task.id}
                                  className={`text-xs p-2 rounded border ${getStatusColor(task.status)}`}
                                >
                                  <div className="font-medium truncate">{task.title}</div>
                                  {task.course && <div className="text-[10px] opacity-80">{task.course}</div>}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <div className="mt-6 flex gap-4 justify-center">
            <Badge variant="outline" className="bg-green-500/20 text-green-500">Completed</Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-500">In Progress</Badge>
            <Badge variant="outline" className="bg-muted text-muted-foreground">Pending</Badge>
            <Badge variant="outline" className="bg-destructive/20 text-destructive">Overdue</Badge>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Timetable;
