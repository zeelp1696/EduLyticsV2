import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DashboardHeaderProps {
  mode: "institution" | "personal";
}

export const DashboardHeader = ({ mode }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="relative z-20 border-b border-border/50 bg-card/30 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full">
            <span className="text-foreground font-semibold">Edulytics</span>
          </div>
        </div>

        {/* Right - Mode Label, Notifications, Profile */}
        <div className="flex items-center gap-4">
          {/* Read-only mode indicator */}
          <div className={`px-4 py-2 rounded-full border-2 ${
            mode === "institution" 
              ? "border-institution/50 bg-institution/10" 
              : "border-personal/50 bg-personal/10"
          }`}>
            <span className={`text-sm font-medium ${
              mode === "institution" ? "text-institution" : "text-personal"
            }`}>
              {mode === "institution" ? "Institution Mode" : "Personal Mode"}
            </span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-card/50 transition-colors group">
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
              mode === "institution" ? "bg-institution" : "bg-personal"
            } animate-pulse`} />
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="w-9 h-9 border-2 border-border/50">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=student" />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md border-border/50">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium text-foreground">{user?.email?.split('@')[0] || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
