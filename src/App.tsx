
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonaCreator from "./pages/PersonaCreator";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layouts/DashboardLayout";
import { supabase } from './integrations/supabase/client';

const queryClient = new QueryClient();

// Authentication wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const isAuthenticated = !!data.session;
      setAuthenticated(isAuthenticated);
      setLoading(false);
      
      if (!isAuthenticated && location.pathname !== '/auth') {
        navigate('/auth', { replace: true });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuthenticated = !!session;
      setAuthenticated(isAuthenticated);
      
      if (!isAuthenticated && location.pathname !== '/auth') {
        navigate('/auth', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return authenticated ? <>{children}</> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<PersonaCreator />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<div>Projects page will go here</div>} />
            <Route path="projects/:id" element={<div>Project detail page will go here</div>} />
            <Route path="projects/new" element={<div>New project form will go here</div>} />
            <Route path="invoices" element={<div>Invoices page will go here</div>} />
            <Route path="documents" element={<div>Documents page will go here</div>} />
            <Route path="notifications" element={<div>Notifications page will go here</div>} />
            <Route path="team" element={<div>Team management page will go here</div>} />
            <Route path="settings" element={<div>Settings page will go here</div>} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
