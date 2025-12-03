import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import PersonalDashboard from "./pages/PersonalDashboard";
import InstitutionDashboard from "./pages/InstitutionDashboard";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import Timetable from "./pages/Timetable";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import InstitutionLogin from "./pages/InstitutionLogin";
import PersonalLogin from "./pages/PersonalLogin";
import PersonalSignup from "./pages/PersonalSignup";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  // Initialize dark mode on app load
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("edulytics-dark-mode");
    const htmlElement = document.documentElement;

    if (savedDarkMode !== null) {
      const isDark = JSON.parse(savedDarkMode);
      if (isDark) {
        htmlElement.classList.remove("light");
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
        htmlElement.classList.add("light");
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        htmlElement.classList.remove("light");
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
        htmlElement.classList.add("light");
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />

              {/* Unified /dashboard (kept for compatibility) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Explicit personal & institution dashboards */}
              <Route
                path="/personal/dashboard"
                element={
                  <ProtectedRoute>
                    <PersonalDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/institution/dashboard"
                element={
                  <ProtectedRoute>
                    <InstitutionDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timetable"
                element={
                  <ProtectedRoute>
                    <Timetable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route path="/institution/login" element={<InstitutionLogin />} />
              <Route path="/personal/login" element={<PersonalLogin />} />
              <Route path="/personal/signup" element={<PersonalSignup />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
