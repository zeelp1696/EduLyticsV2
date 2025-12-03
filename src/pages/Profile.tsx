import { DashboardHeader } from "@/components/DashboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Calendar, Award } from "lucide-react";

const Profile = () => {
  const { mode, role, user } = useAuth();
  const userRole = role || "student";
  const dashboardMode = mode || "institution";

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
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground mt-1">Your account information</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <GlassCard hover className="animate-slide-up lg:col-span-1">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4 border-4 border-border/50">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=student" />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {user?.email?.split('@')[0] || "User"}
                </h2>
                <Badge className={dashboardMode === "institution" ? "bg-institution/20 text-institution" : "bg-personal/20 text-personal"}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
                <Badge variant="outline" className="mt-2">
                  {dashboardMode === "institution" ? "Institution" : "Personal"} Account
                </Badge>
              </div>
            </GlassCard>

            {/* Details Card */}
            <GlassCard hover className="animate-slide-up lg:col-span-2" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl ${dashboardMode === "institution" ? "bg-institution/20" : "bg-personal/20"}`}>
                  <User className={`w-5 h-5 ${dashboardMode === "institution" ? "text-institution" : "text-personal"}`} />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Account Details</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card/30">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground font-medium">{user?.email || "No email"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-card/30">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-foreground font-medium">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-card/30">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="text-foreground font-medium">
                      {dashboardMode === "institution" ? "Institution" : "Personal"} - {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
