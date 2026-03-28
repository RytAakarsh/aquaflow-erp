import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavLink } from "react-router-dom";
import { Fish, LayoutDashboard, Upload, Bell, LogOut, ClipboardList, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageToggle from "@/components/LanguageToggle";

const FarmerLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const NAV = [
    { to: "/farmer", icon: LayoutDashboard, label: t("dashboard"), end: true },
    { to: "/farmer/daily-update", icon: Upload, label: t("update") },
    { to: "/farmer/tasks", icon: ClipboardList, label: t("tasks") },
    { to: "/farmer/chat", icon: Bot, label: t("aquaBot") },
    { to: "/farmer/notifications", icon: Bell, label: t("alerts") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-card">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Fish className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground font-heading">AquaFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
            <button onClick={logout} className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-card border-t border-border z-50 sm:hidden">
        <div className="flex justify-around py-2">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-0.5 text-xs py-1 px-3 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <nav className="hidden sm:flex fixed top-14 inset-x-0 bg-card border-b border-border z-40">
        <div className="max-w-5xl mx-auto flex gap-1 px-4 py-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="hidden sm:block h-12" />
    </div>
  );
};

export default FarmerLayout;
