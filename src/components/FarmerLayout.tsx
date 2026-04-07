import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavLink } from "react-router-dom";
import {
  Home, FileText, CheckSquare, MessageCircle, Bell,
  Fish, Users, Egg, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageToggle from "@/components/LanguageToggle";

const FarmerLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const pt = language === "pt";

  const NAV = [
    { to: "/farmer", icon: Home, label: pt ? "Início" : "Home", end: true },
    { to: "/farmer/daily-update", icon: FileText, label: pt ? "Diário" : "Update" },
    { to: "/farmer/broodstock", icon: Fish, label: pt ? "Reprodutores" : "Broodstock" },
    { to: "/farmer/breeding-groups", icon: Users, label: pt ? "Grupos" : "Groups" },
    { to: "/farmer/egg-batches", icon: Egg, label: pt ? "Ovos" : "Eggs" },
    { to: "/farmer/tasks", icon: CheckSquare, label: t("tasks") },
    { to: "/farmer/chat", icon: MessageCircle, label: "AquaBot" },
    { to: "/farmer/notifications", icon: Bell, label: pt ? "Alertas" : "Alerts" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Fish className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground font-heading text-sm">AquaFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <span className="text-xs text-muted-foreground hidden sm:inline">{user?.name}</span>
          <button onClick={logout} className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <nav className="hidden sm:flex sticky top-14 z-40 bg-card border-b border-border px-4 gap-1 overflow-x-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 whitespace-nowrap",
              isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 p-4 sm:p-6 pb-20 sm:pb-6">{children}</main>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around py-1.5">
        {NAV.slice(0, 5).map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default FarmerLayout;
