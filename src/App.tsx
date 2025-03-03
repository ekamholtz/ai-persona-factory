
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AvatarStudio from "./pages/AvatarStudio";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import Settings from "./pages/Settings";
import AuthPage from "./pages/AuthPage";
import AuthRequired from "./components/auth/AuthRequired";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected routes */}
          <Route element={<AuthRequired />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<AvatarStudio />} />
            <Route path="/edit/:avatarId" element={<AvatarStudio />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
