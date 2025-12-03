import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Target, CheckCircle2, Clock } from "lucide-react";

const Reports = () => {
  const { mode, role } = useAuth();
  const userRole = role || "student";
  const dashboardMode = mode || "institution";
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setTasks(data);
      setStats({
        total: data.length,
        completed: data.filter((t) => t.status === "completed").length,
        inProgress: data.filter((t) => t.status === "in_progress").length,
        pending: data.filter((t) => t.status === "pending").length,
        overdue: data.filter((t) => t.status === "overdue").length,
      });
    }
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const activeRate = stats.total > 0 ? Math.round(((stats.completed + stats.inProgress) / stats.total) * 100) : 0;

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
            <h1 className="text-3xl font-bold text-foreground">Progress Reports</h1>
            <p className="text-muted-foreground mt-1">
              {dashboardMode === "institution" ? "Track your academic progress" : "Monitor your learning journey"}
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <GlassCard hover className="animate-slide-up">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-xl ${dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"}`}>
                  <Target className={`w-6 h-6 ${dashboardMode === "institution" ? "text-institution" : "text-personal"}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </GlassCard>

            <GlassCard hover className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </GlassCard>

            <GlassCard hover className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </GlassCard>

            <GlassCard hover className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </GlassCard>
          </div>

          {/* Detailed Progress */}
          <div className="grid lg:grid-cols-2 gap-6">
            <GlassCard hover className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl ${dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"}`}>
                  <TrendingUp className={`w-5 h-5 ${dashboardMode === "institution" ? "text-institution" : "text-personal"}`} />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Overall Progress</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="text-sm font-semibold text-foreground">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className={dashboardMode === "personal" ? "[&>div]:bg-personal" : ""} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Active Tasks Progress</span>
                    <span className="text-sm font-semibold text-foreground">{activeRate}%</span>
                  </div>
                  <Progress value={activeRate} className={dashboardMode === "personal" ? "[&>div]:bg-personal" : ""} />
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                      <p className="text-xs text-muted-foreground">Done</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-destructive">{stats.overdue}</p>
                      <p className="text-xs text-muted-foreground">Overdue</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard hover className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl ${dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"}`}>
                  <CheckCircle2 className={`w-5 h-5 ${dashboardMode === "institution" ? "text-institution" : "text-personal"}`} />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Task Breakdown</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-card/30">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-500">Completed</Badge>
                    <span className="text-sm text-foreground">{stats.completed} tasks</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-card/30">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-500">In Progress</Badge>
                    <span className="text-sm text-foreground">{stats.inProgress} tasks</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-card/30">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-muted text-muted-foreground">Pending</Badge>
                    <span className="text-sm text-foreground">{stats.pending} tasks</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-card/30">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-destructive/20 text-destructive">Overdue</Badge>
                    <span className="text-sm text-foreground">{stats.overdue} tasks</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {stats.total > 0 ? Math.round((stats.overdue / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
