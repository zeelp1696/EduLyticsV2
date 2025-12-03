import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { ProgressBar } from "@/components/ProgressBar";
import { FeatureCard } from "@/components/FeatureCard";
import { StepCard } from "@/components/StepCard";
import { SecurityCard } from "@/components/SecurityCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  CalendarCheck, 
  ListChecks, 
  ShieldCheck, 
  Users2,
  UserPlus,
  ClipboardCheck,
  Sparkles,
  Lock,
  Key,
  Shield,
  Database,
  FileCheck,
  BadgeCheck
} from "lucide-react";


const Landing = () => {
  const [mode, setMode] = useState<"institution" | "personal">("personal");
  const navigate = useNavigate();


  const handleGetStarted = () => {
    navigate(mode === "institution" ? "/institution/login" : "/personal/signup");
  };

  const handleSignUp = () => {
    navigate(mode === "institution" ? "/institution/login" : "/personal/login");
  };


  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-institution/10 rounded-full blur-3xl top-20 -left-20 animate-float" />
        <div className="absolute w-96 h-96 bg-personal/10 rounded-full blur-3xl bottom-20 -right-20 animate-float" style={{ animationDelay: "1s" }} />
      </div>


      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="px-6 py-3 bg-card/30 backdrop-blur-sm border border-border/50 rounded-full">
          <span className="text-foreground font-semibold">Edulytics</span>
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </header>


      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full text-sm text-muted-foreground">
              Unified Educational Platform
            </div>
            
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                One Schedule.
              </h1>
              <h2 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
                mode === "institution" 
                  ? "from-institution to-institution-glow" 
                  : "from-personal to-personal-glow"
              } bg-clip-text text-transparent transition-all duration-500`}>
                Two Ways to Stay on Track.
              </h2>
            </div>


            <p className="text-lg text-muted-foreground max-w-xl">
              {mode === "institution"
                ? "Empower your institution with master timetables, teacher task management, and seamless verification workflows."
                : "Transform your learning journey with AI-powered study planning, progress tracking, and intelligent schedule correction."}
            </p>


            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className={`${
                  mode === "institution" 
                    ? "bg-gradient-to-r from-institution to-institution-glow hover:opacity-90" 
                    : "bg-gradient-to-r from-personal to-personal-glow hover:opacity-90"
                } transition-all duration-300 shadow-lg group`}
              >
                {mode === "institution" ? "Institution Login" : "Get Started Free"}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-card/50"
                onClick={handleSignUp}
              >
                {mode === "institution" ? "Request Demo" : "Sign Up"}
              </Button>
            </div>


            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <StatCard value={mode === "institution" ? "500+" : "10K+"} label={mode === "institution" ? "Institutions" : "Active Users"} />
              <StatCard value={mode === "institution" ? "50K+" : "100K+"} label="Schedules" />
              <StatCard value="98%" label="Satisfaction" />
            </div>
          </div>


          {/* Right Content - Preview Cards */}
          <div className="space-y-6 animate-slide-up">
            {/* Card 1 */}
            <GlassCard hover className="animate-float">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  mode === "institution" ? "bg-institution/20" : "bg-personal/20"
                }`}>
                  <Calendar className={`w-6 h-6 ${
                    mode === "institution" ? "text-institution" : "text-personal"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {mode === "institution" ? "Master Timetable" : "Study Schedule"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Active Now</p>
                  <div className="space-y-3">
                    <ProgressBar value={75} mode={mode} />
                    <ProgressBar value={60} mode={mode} />
                    <ProgressBar value={90} mode={mode} />
                  </div>
                </div>
              </div>
            </GlassCard>


            {/* Card 2 */}
            <GlassCard hover className="ml-12 animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  mode === "institution" ? "bg-institution/20" : "bg-personal/20"
                }`}>
                  <BookOpen className={`w-6 h-6 ${
                    mode === "institution" ? "text-institution" : "text-personal"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {mode === "institution" ? "Teacher Tasks" : "Progress Tracking"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Updated</p>
                  <div className="space-y-2">
                    <ProgressBar value={85} mode={mode} />
                    <ProgressBar value={45} mode={mode} />
                    <ProgressBar value={100} mode={mode} />
                  </div>
                </div>
              </div>
            </GlassCard>


            {/* Card 3 */}
            <GlassCard hover className="animate-float" style={{ animationDelay: "1s" }}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  mode === "institution" ? "bg-institution/20" : "bg-personal/20"
                }`}>
                  <CheckCircle2 className={`w-6 h-6 ${
                    mode === "institution" ? "text-institution" : "text-personal"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm text-muted-foreground mb-2">
                    {mode === "institution" ? "Verification Status" : "Days Behind"}
                  </h3>
                  <div className={`text-3xl font-bold ${
                    mode === "institution" ? "text-institution" : "text-personal"
                  }`}>
                    {mode === "institution" ? "✓ Verified" : "0 Days"}
                  </div>
                  <ProgressBar value={100} mode={mode} className="mt-4" />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>


      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Tools for Educational Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage schedules, tasks, and workflows across your institution.
          </p>
        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          <FeatureCard
            icon={CalendarCheck}
            title="Master Timetables"
            description="Create and manage comprehensive schedules for your entire institution with ease."
            mode={mode}
          />
          <FeatureCard
            icon={ListChecks}
            title="Teacher Task Management"
            description="Assign, track, and verify teacher tasks with intelligent workflows."
            mode={mode}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Verification Flow"
            description="Streamlined approval process with proof submissions and admin verification."
            mode={mode}
          />
          <FeatureCard
            icon={Users2}
            title="Multi-Role Access"
            description="Tailored experiences for admins, teachers, and students in one platform."
            mode={mode}
          />
        </div>
      </section>


      {/* How It Works Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full text-sm text-muted-foreground mb-6">
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            How It Works
          </h2>
        </div>


        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StepCard
            step={1}
            icon={UserPlus}
            title="Create Your Account"
            description="Sign up for your institution or personal account in seconds. No credit card required."
            mode={mode}
          />
          <StepCard
            step={2}
            icon={ClipboardCheck}
            title="Set Up Your Schedule"
            description="Import existing timetables or create new ones with our intuitive interface."
            mode={mode}
          />
          <StepCard
            step={3}
            icon={Sparkles}
            title="Track & Optimize"
            description="Monitor progress, verify tasks, and let AI help optimize your workflow."
            mode={mode}
          />
        </div>


        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className={`${
              mode === "institution" 
                ? "bg-gradient-to-r from-institution to-institution-glow hover:opacity-90" 
                : "bg-gradient-to-r from-personal to-personal-glow hover:opacity-90"
            } transition-all duration-300 shadow-lg`}
          >
            Start Your {mode === "institution" ? "Institution" : "Learning"} Trial
          </Button>
        </div>
      </section>


      {/* Security Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Security & Privacy First
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your data is protected with enterprise-grade security measures.
          </p>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <SecurityCard icon={Lock} title="End-to-End Encryption" mode={mode} />
          <SecurityCard icon={Key} title="JWT Authentication" mode={mode} />
          <SecurityCard icon={Shield} title="Role-Based Access" mode={mode} />
          <SecurityCard icon={Database} title="Private Data Storage" mode={mode} />
          <SecurityCard icon={FileCheck} title="Audit Logging" mode={mode} />
          <SecurityCard icon={BadgeCheck} title="GDPR Compliant" mode={mode} />
        </div>


        <div className="flex flex-wrap justify-center gap-8">
          {["ISO 27001", "SOC 2", "GDPR", "256-bit Encryption"].map((badge) => (
            <div key={badge} className="px-6 py-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full text-sm font-medium text-muted-foreground">
              {badge}
            </div>
          ))}
        </div>
      </section>


      <Footer />
    </div>
  );
};


export default Landing;