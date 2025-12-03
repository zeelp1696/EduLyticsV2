import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, BookOpen, Phone } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const PersonalSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile_number: formData.mobile_number || null,
          account_type: "personal",
        }),
      });

      if (!res.ok) {
        let detail = "Signup failed. Please try again.";
        try {
          const data = await res.json();
          if (data?.detail) {
            detail = Array.isArray(data.detail)
              ? data.detail.map((d: any) => d.msg || d).join(", ")
              : data.detail;
          }
        } catch {
          // ignore JSON parse error
        }
        setError(detail);
        return;
      }

      // success → go to login
      navigate("/personal/login");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-personal/10 rounded-full blur-3xl top-20 -left-20 animate-float" />
        <div
          className="absolute w-96 h-96 bg-personal/5 rounded-full blur-3xl bottom-20 -right-20 animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left - Signup Form */}
          <GlassCard className="max-w-md mx-auto w-full animate-fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create Your
              </h1>
              <h2 className="text-3xl font-bold text-personal">
                Learning Journey
              </h2>
              <p className="text-muted-foreground mt-3">
                Join thousands of learners achieving their goals with AI-powered
                study planning.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10 bg-input border-border focus:border-personal transition-colors"
                  />
                </div>
              </div>

              {/* Email (can be any string, backend allows anything) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email / ID
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="zeelp1696"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 bg-input border-border focus:border-personal transition-colors"
                  />
                </div>
              </div>

              {/* Mobile number */}
              <div className="space-y-2">
                <Label htmlFor="mobile_number" className="text-foreground">
                  Mobile Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="mobile_number"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.mobile_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile_number: e.target.value,
                      })
                    }
                    className="pl-10 bg-input border-border focus:border-personal transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 bg-input border-border focus:border-personal transition-colors"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="pl-10 bg-input border-border focus:border-personal transition-colors"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-personal to-personal-glow hover:opacity-90 transition-opacity shadow-lg shadow-personal/30"
                size="lg"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/personal/login")}
                  className="text-personal hover:text-personal-glow transition-colors font-medium"
                >
                  Log in
                </button>
              </p>
              <button
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </GlassCard>

          {/* Right - Preview Card (unchanged UI) */}
          <GlassCard className="animate-slide-up hidden lg:block">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-personal/20">
                <BookOpen className="w-6 h-6 text-personal" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Your Study Plan
                </h3>
                <p className="text-sm text-muted-foreground">AI Powered</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { subject: "Mathematics", progress: 65 },
                { subject: "Physics", progress: 55 },
                { subject: "Literature", progress: 85 },
                { subject: "History", progress: 78 },
              ].map((item) => (
                <div key={item.subject} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-personal rounded-full" />
                    <span className="text-foreground font-medium">
                      {item.subject}
                    </span>
                  </div>
                  <ProgressBar value={item.progress} mode="personal" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border/50">
              <div>
                <div className="text-3xl font-bold text-personal">120+</div>
                <div className="text-sm text-muted-foreground">
                  Study Sessions
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-personal">85%</div>
                <div className="text-sm text-muted-foreground">
                  Completion Rate
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default PersonalSignup;
