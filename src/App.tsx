import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import FarmerLayout from "./components/FarmerLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Farmers from "./pages/admin/Farmers";
import { Breeding, Hatchery, Nursery, Processing, Inventory, Finance, Analytics, Alerts } from "./pages/admin/ModulePlaceholder";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import DailyUpdate from "./pages/farmer/DailyUpdate";
import Tasks from "./pages/farmer/Tasks";
import Notifications from "./pages/farmer/Notifications";
import AquaChat from "./pages/farmer/AquaChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Login />;

  if (user.role === "farmer") {
    return (
      <FarmerLayout>
        <Routes>
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/daily-update" element={<DailyUpdate />} />
          <Route path="/farmer/tasks" element={<Tasks />} />
          <Route path="/farmer/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/farmer" replace />} />
        </Routes>
      </FarmerLayout>
    );
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/breeding" element={<Breeding />} />
        <Route path="/admin/hatchery" element={<Hatchery />} />
        <Route path="/admin/nursery" element={<Nursery />} />
        <Route path="/admin/farmers" element={<Farmers />} />
        <Route path="/admin/processing" element={<Processing />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/finance" element={<Finance />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/alerts" element={<Alerts />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
