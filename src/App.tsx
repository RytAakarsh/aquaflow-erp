import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BreedingProvider } from "@/contexts/BreedingContext";
import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import FarmerLayout from "./components/FarmerLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Farmers from "./pages/admin/Farmers";
import { Breeding, Hatchery, Nursery, Processing, Inventory, Finance, Analytics, Alerts } from "./pages/admin/ModulePlaceholder";
import FarmerUpdates from "./pages/admin/FarmerUpdates";
import AdminBreedingOverview from "./pages/admin/BreedingOverview";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import DailyUpdate from "./pages/farmer/DailyUpdate";
import Tasks from "./pages/farmer/Tasks";
import Notifications from "./pages/farmer/Notifications";
import AquaChat from "./pages/farmer/AquaChat";
import BroodstockEntry from "./pages/farmer/BroodstockEntry";
import BreedingGroups from "./pages/farmer/BreedingGroups";
import EggBatchManagement from "./pages/farmer/EggBatchManagement";
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
          <Route path="/farmer/chat" element={<AquaChat />} />
          <Route path="/farmer/notifications" element={<Notifications />} />
          <Route path="/farmer/broodstock" element={<BroodstockEntry />} />
          <Route path="/farmer/breeding-groups" element={<BreedingGroups />} />
          <Route path="/farmer/egg-batches" element={<EggBatchManagement />} />
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
        <Route path="/admin/breeding-overview" element={<AdminBreedingOverview />} />
        <Route path="/admin/hatchery" element={<Hatchery />} />
        <Route path="/admin/nursery" element={<Nursery />} />
        <Route path="/admin/farmers" element={<Farmers />} />
        <Route path="/admin/farmer-updates" element={<FarmerUpdates />} />
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
      <LanguageProvider>
        <AuthProvider>
          <BreedingProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </BreedingProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
