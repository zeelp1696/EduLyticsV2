import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Clock,
  Moon,
  Sun,
  Globe,
  Check,
  ChevronRight,
} from "lucide-react";

const Settings = () => {
  const { mode } = useAuth();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [language, setLanguage] = useState("english");
  const [region, setRegion] = useState("India");
  const [isLoading, setIsLoading] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);

  const languages = [
    { code: "english", name: "English" },
  ];

  const regions = [
    { name: "India", emoji: "🇮🇳", region: "Asia" },
    { name: "United States", emoji: "🇺🇸", region: "North America" },
    { name: "United Kingdom", emoji: "🇬🇧", region: "Europe" },
    { name: "Canada", emoji: "🇨🇦", region: "North America" },
    { name: "Australia", emoji: "🇦🇺", region: "Oceania" },
    { name: "Germany", emoji: "🇩🇪", region: "Europe" },
    { name: "France", emoji: "🇫🇷", region: "Europe" },
    { name: "Japan", emoji: "🇯🇵", region: "Asia" },
    { name: "Singapore", emoji: "🇸🇬", region: "Asia" },
    { name: "United Arab Emirates", emoji: "🇦🇪", region: "Middle East" },
  ];

  // Initialize all settings from localStorage or system preference
  useEffect(() => {
    try {
      setIsLoading(true);

      // Dark Mode - Check localStorage first, then system preference
      const savedDarkMode = localStorage.getItem("edulytics-dark-mode");
      if (savedDarkMode !== null) {
        const isDark = JSON.parse(savedDarkMode);
        setDarkMode(isDark);
        applyTheme(isDark);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(prefersDark);
        applyTheme(prefersDark);
      }

      // Task Notifications
      const savedTaskNotif = localStorage.getItem("edulytics-task-notifications");
      setTaskNotifications(savedTaskNotif ? JSON.parse(savedTaskNotif) : true);

      // Task Reminders
      const savedTaskReminders = localStorage.getItem("edulytics-task-reminders");
      setTaskReminders(savedTaskReminders ? JSON.parse(savedTaskReminders) : true);

      // Language
      const savedLanguage = localStorage.getItem("edulytics-language");
      setLanguage(savedLanguage || "english");

      // Region
      const savedRegion = localStorage.getItem("edulytics-region");
      setRegion(savedRegion || "India");

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading settings:", error);
      setIsLoading(false);
    }
  }, []);

  // Apply theme to document
  const applyTheme = (isDark: boolean) => {
    const html = document.documentElement;
    
    if (isDark) {
      html.classList.remove("light");
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem("edulytics-dark-mode", JSON.stringify(checked));
    applyTheme(checked);
    
    toast({
      title: "Success",
      description: `${checked ? "Dark" : "Light"} mode enabled`,
      variant: "default",
    });
  };

  // Handle task notifications toggle
  const handleTaskNotificationsToggle = (checked: boolean) => {
    setTaskNotifications(checked);
    localStorage.setItem("edulytics-task-notifications", JSON.stringify(checked));
    toast({
      title: "Success",
      description: `Task notifications ${checked ? "enabled" : "disabled"}`,
      variant: "default",
    });
  };

  // Handle task reminders toggle
  const handleTaskRemindersToggle = (checked: boolean) => {
    setTaskReminders(checked);
    localStorage.setItem("edulytics-task-reminders", JSON.stringify(checked));
    toast({
      title: "Success",
      description: `Task reminders ${checked ? "enabled" : "disabled"}`,
      variant: "default",
    });
  };

  // Handle language change
  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    localStorage.setItem("edulytics-language", langCode);
    setShowLanguageModal(false);
    
    const langName = languages.find(l => l.code === langCode)?.name || "English";
    toast({
      title: "Success",
      description: `Language changed to ${langName}`,
      variant: "default",
    });
  };

  // Handle region change
  const handleRegionChange = (regionName: string) => {
    setRegion(regionName);
    localStorage.setItem("edulytics-region", regionName);
    setShowRegionModal(false);
    
    toast({
      title: "Success",
      description: `Region changed to ${regionName}`,
      variant: "default",
    });
  };

  // Pre-calculate colors based on mode
  const notificationsBgColor = mode === "institution" ? "bg-institution/20" : "bg-personal/20";
  const notificationsIconColor = mode === "institution" ? "text-institution" : "text-personal";
  
  const appearanceBgColor = mode === "institution" ? "bg-institution/20" : "bg-personal/20";
  const appearanceIconColor = mode === "institution" ? "text-institution" : "text-personal";
  
  const languageBgColor = mode === "institution" ? "bg-institution/20" : "bg-personal/20";
  const languageIconColor = mode === "institution" ? "text-institution" : "text-personal";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences and application settings</p>
          </div>

          <div className="space-y-6 max-w-2xl animate-slide-up">
            {/* Notifications Section */}
            <GlassCard hover>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${notificationsBgColor}`}>
                    <Bell className={`w-5 h-5 ${notificationsIconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Notifications
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Control how you receive notifications
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Task Notifications */}
                <div className="flex items-center justify-between p-4 bg-card rounded-lg hover:bg-card/80 transition-colors">
                  <div className="flex-1">
                    <Label className="text-foreground font-medium mb-1 block">
                      Task Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new tasks and updates
                    </p>
                  </div>
                  <div className="ml-4">
                    <Switch
                      checked={taskNotifications}
                      onCheckedChange={handleTaskNotificationsToggle}
                      aria-label="Toggle task notifications"
                    />
                  </div>
                </div>

                {/* Task Reminders */}
                <div className="flex items-center justify-between p-4 bg-card rounded-lg hover:bg-card/80 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <Label className="text-foreground font-medium mb-1 block">
                        Task Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders for upcoming tasks and deadlines
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Switch
                      checked={taskReminders}
                      onCheckedChange={handleTaskRemindersToggle}
                      aria-label="Toggle task reminders"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Appearance Section */}
            <GlassCard hover>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${appearanceBgColor}`}>
                    <Sun className={`w-5 h-5 ${appearanceIconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Appearance
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Customize how the application looks
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-card rounded-lg hover:bg-card/80 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    {darkMode ? (
                      <Moon className="w-5 h-5 flex-shrink-0 text-primary" />
                    ) : (
                      <Sun className="w-5 h-5 flex-shrink-0 text-primary" />
                    )}
                    <div>
                      <Label className="text-foreground font-medium mb-1 block">
                        {darkMode ? "Dark Mode" : "Light Mode"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {darkMode
                          ? "Easy on the eyes at night"
                          : "Bright and clear during the day"}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Switch
                      checked={darkMode}
                      onCheckedChange={handleDarkModeToggle}
                      aria-label="Toggle dark mode"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Language & Region Section */}
            <GlassCard hover>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${languageBgColor}`}>
                    <Globe className={`w-5 h-5 ${languageIconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Language & Region
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred language and region
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Language Selection */}
                <div>
                  <Label className="text-foreground font-medium mb-3 block text-sm">
                    Language
                  </Label>
                  <button
                    onClick={() => setShowLanguageModal(!showLanguageModal)}
                    className="w-full p-4 bg-card rounded-lg hover:bg-card/80 transition-colors flex items-center justify-between border border-border"
                  >
                    <span className="text-foreground font-medium">
                      {languages.find(l => l.code === language)?.name || "English"}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>

                  {showLanguageModal && (
                    <div className="mt-3 p-4 bg-card rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-3">Coming soon: Support for multiple languages</p>
                      <div className="space-y-2">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              language === lang.code
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary-hover text-foreground"
                            }`}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Region Selection */}
                <div>
                  <Label className="text-foreground font-medium mb-3 block text-sm">
                    Region
                  </Label>
                  <button
                    onClick={() => setShowRegionModal(!showRegionModal)}
                    className="w-full p-4 bg-card rounded-lg hover:bg-card/80 transition-colors flex items-center justify-between border border-border"
                  >
                    <span className="text-foreground font-medium">
                      {region && regions.find(r => r.name === region)?.emoji} {region}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>

                  {showRegionModal && (
                    <div className="mt-3 p-4 bg-card rounded-lg border border-border max-h-64 overflow-y-auto">
                      <div className="space-y-2">
                        {regions.map((reg) => (
                          <button
                            key={reg.name}
                            onClick={() => handleRegionChange(reg.name)}
                            className={`w-full p-3 rounded-lg text-left transition-colors flex items-center justify-between ${
                              region === reg.name
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary-hover text-foreground"
                            }`}
                          >
                            <div>
                              <span className="text-lg mr-2">{reg.emoji}</span>
                              <span className="font-medium">{reg.name}</span>
                              <span className="text-xs ml-2 opacity-70">({reg.region})</span>
                            </div>
                            {region === reg.name && (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Settings Summary */}
            <div className="p-4 bg-card rounded-lg border border-border space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  All settings are saved automatically to your browser
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Your preferences will be restored when you visit again
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Changes take effect immediately across the application
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;