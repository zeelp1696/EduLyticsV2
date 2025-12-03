import { NavLink } from "./NavLink";
import { 
  LayoutDashboard, 
  Calendar, 
  ListTodo, 
  CalendarRange, 
  BarChart3, 
  Settings,
  UserCog,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mode: "institution" | "personal";
  userRole?: "student" | "teacher" | "admin";
}

export const Sidebar = ({ mode, userRole = "student" }: SidebarProps) => {
  const baseItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: ListTodo, label: "Tasks", path: "/tasks" },
    { icon: CalendarRange, label: "Timetable", path: "/timetable" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const conditionalItems = [];
  if (mode === "institution" && userRole === "teacher") {
    conditionalItems.push({ icon: UserCog, label: "Teacher Panel", path: "/teacher-panel" });
  }
  if (mode === "institution" && userRole === "admin") {
    conditionalItems.push({ icon: ShieldCheck, label: "Admin Panel", path: "/admin-panel" });
  }

  const allItems = [...baseItems.slice(0, 5), ...conditionalItems, ...baseItems.slice(5)];

  return (
    <aside className="w-64 border-r border-border/50 bg-card/20 backdrop-blur-md min-h-[calc(100vh-73px)] p-4 relative z-10">
      <nav className="space-y-2">
        {allItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-all group"
            )}
            activeClassName={cn(
              "text-foreground font-medium",
              mode === "institution" 
                ? "bg-institution/20 border-l-4 border-institution shadow-lg shadow-institution/20" 
                : "bg-personal/20 border-l-4 border-personal shadow-lg shadow-personal/20"
            )}
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
