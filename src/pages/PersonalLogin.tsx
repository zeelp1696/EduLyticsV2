import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const PersonalLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const body = new URLSearchParams();
      body.append("username", email);
      body.append("password", password);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      if (!res.ok) {
        let detail = "Login failed. Please check your credentials.";
        try {
          const data = await res.json();
          if (data?.detail) {
            detail = Array.isArray(data.detail)
              ? data.detail.map((d: any) => d.msg || d).join(", ")
              : data.detail;
          }
        } catch {
          // ignore json error
        }
        setError(detail);
        return;
      }

      const data = await res.json(); // { access_token, token_type }
      const token = data?.access_token;
      if (!token) {
        setError("No token received from server.");
        return;
      }

      // store token for later API calls
      localStorage.setItem("authToken", token);

      // optional: fetch current user to confirm & store basic info
      try {
        const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          // store minimal user info
          localStorage.setItem("edulytics_user", JSON.stringify(meData));
        }
      } catch (err) {
        console.warn("Failed to fetch current user", err);
      }

      // go to personal dashboard
      navigate("/personal/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-personal/10 rounded-full blur-3xl top-20 left-1/4 animate-float" />
        <div
          className="absolute w-96 h-96 bg-personal/5 rounded-full blur-3xl bottom-20 right-1/4 animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <GlassCard className="max-w-md w-full mx-4 animate-fade-in relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back,
          </h1>
          <h2 className="text-3xl font-bold text-personal">Learner</h2>
          <p className="text-muted-foreground mt-3">
            Continue your personalized learning journey and achieve your goals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="learner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-input border-border focus:border-personal transition-colors"
              />
            </div>
          </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-input border-border focus:border-personal transition-colors"
              />
            </div>
          </div>

          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-personal transition-colors"
          >
            Forgot Password?
          </button>

          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-personal to-personal-glow hover:opacity-90 transition-opacity shadow-lg shadow-personal/30"
            size="lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            New here?{" "}
            <button
              onClick={() => navigate("/personal/signup")}
              className="text-personal hover:text-personal-glow transition-colors font-medium"
            >
              Create account
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
    </div>
  );
};

export default PersonalLogin;
