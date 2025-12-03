import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Send, Plus, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Tasks = () => {
  const { mode, role } = useAuth();
  const userRole = role || "student";
  const dashboardMode = mode || "institution";
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } else {
      setTasks(data || []);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";
    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          context: "tasks"
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Chat error:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-500";
      case "in_progress": return "bg-blue-500/20 text-blue-500";
      case "overdue": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/20 text-destructive";
      case "medium": return "bg-amber-500/20 text-amber-500";
      default: return "bg-muted text-muted-foreground";
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
            <h1 className="text-3xl font-bold text-foreground">
              {dashboardMode === "institution" ? "My Tasks" : "Task Planner"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {dashboardMode === "institution" ? "Tasks assigned by teachers" : "AI-powered task management"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* AI Chat Section */}
            <GlassCard hover className="animate-slide-up h-[600px] flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"}`}>
                  <Plus className={`w-5 h-5 ${dashboardMode === "institution" ? "text-institution" : "text-personal"}`} />
                </div>
                <h2 className="text-xl font-semibold text-foreground">AI Task Assistant</h2>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-3 scrollbar-thin">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Tell me what you need to do and I'll help you organize it into tasks!
                    </p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-xl ${msg.role === "user" ? "bg-card/50 ml-8" : "bg-card/30 mr-8"}`}>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Describe your task..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className={dashboardMode === "institution" ? "bg-institution hover:bg-institution/90" : "bg-personal hover:bg-personal/90"}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>

            {/* Tasks List */}
            <GlassCard hover className="animate-slide-up h-[600px] flex flex-col" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"}`}>
                    <CalendarIcon className={`w-5 h-5 ${dashboardMode === "institution" ? "text-institution" : "text-personal"}`} />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Your Tasks</h2>
                </div>
                <Badge variant="outline">{tasks.length} tasks</Badge>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No tasks yet. Use the AI assistant to create some!</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="p-4 rounded-xl bg-card/30 hover:bg-card/50 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)} variant="outline">
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getStatusColor(task.status)}>{task.status.replace('_', ' ')}</Badge>
                        {task.course && <Badge variant="secondary">{task.course}</Badge>}
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;
