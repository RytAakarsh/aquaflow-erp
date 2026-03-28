import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavLink, useLocation } from "react-router-dom";
import {
  Fish, LayoutDashboard, Egg, Bug, Waves, Users, Factory, Package,
  DollarSign, BarChart3, Bell, LogOut, Menu, X, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LanguageToggle from "@/components/LanguageToggle";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const NAV_ITEMS = [
    { to: "/admin", icon: LayoutDashboard, label: t("dashboard"), end: true },
    { to: "/admin/breeding", icon: Egg, label: t("breeding") },
    { to: "/admin/hatchery", icon: Bug, label: t("hatchery") },
    { to: "/admin/nursery", icon: Waves, label: t("nursery") },
    { to: "/admin/farmers", icon: Users, label: t("farmers") },
    { to: "/admin/processing", icon: Factory, label: t("processing") },
    { to: "/admin/inventory", icon: Package, label: t("inventory") },
    { to: "/admin/finance", icon: DollarSign, label: t("finance") },
    { to: "/admin/analytics", icon: BarChart3, label: t("analytics") },
    { to: "/admin/alerts", icon: Bell, label: t("alerts") },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 gradient-sidebar flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Fish className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground font-heading">AquaFlow</span>
          <button className="ml-auto lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            {t("signOut")}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="hidden sm:inline">AquaFlow</span>
              <ChevronRight className="w-4 h-4 mx-1 hidden sm:inline" />
              <span className="font-medium text-foreground capitalize">
                {location.pathname.split("/").pop() || t("dashboard")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
