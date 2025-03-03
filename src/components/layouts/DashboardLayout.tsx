
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Home, FileText, CreditCard, FolderOpen, Bell, Users, Settings, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">PayTrak</h2>
        </div>
        <nav className="mt-6">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => 
              `flex items-center py-3 px-6 hover:bg-gray-100 ${isActive ? 'bg-gray-100 border-l-4 border-primary' : ''}`
            }
          >
            <Home className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/dashboard/projects" 
            className={({ isActive }) => 
              `flex items-center py-3 px-6 hover:bg-gray-100 ${isActive ? 'bg-gray-100 border-l-4 border-primary' : ''}`
            }
          >
            <FileText className="mr-3 h-5 w-5" />
            <span>Projects</span>
          </NavLink>
          <NavLink 
            to="/dashboard/invoices" 
            className={({ isActive }) => 
              `flex items-center py-3 px-6 hover:bg-gray-100 ${isActive ? 'bg-gray-100 border-l-4 border-primary' : ''}`
            }
          >
            <CreditCard className="mr-3 h-5 w-5" />
            <span>Invoices</span>
          </NavLink>
          <NavLink 
            to="/dashboard/documents" 
            className={({ isActive }) => 
              `flex items-center py-3 px-6 hover:bg-gray-100 ${isActive ? 'bg-gray-100 border-l-4 border-primary' : ''}`
            }
          >
            <FolderOpen className="mr-3 h-5 w-5" />
            <span>Documents</span>
          </NavLink>
          <NavLink 
            to="/dashboard/notifications" 
            className={({ isActive }) => 
              `flex items-center py-3 px-6 hover:bg-gray-100 ${isActive ? 'bg-gray-100 border-l-4 border-primary' : ''}`
            }
          >
            <Bell className="mr-3 h-5 w-5" />
            <span>Notifications</span>
          </NavLink>
          <NavLink 
            to="/dashboard/team" 
            className={({ isActive }) => 
              `flex items-center py-3 px-6 hover:bg-gray-100 ${isActive ? 'bg-gray-100 border-l-4 border-primary' : ''}`
            }
          >
            <Users className="mr-3 h-5 w-5" />
            <span>Team</span>
          </NavLink>
          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => 
              `flex items-center py-3 px-6 hover:bg-gray-100 ${isActive ? 'bg-gray-100 border-l-4 border-primary' : ''}`
            }
          >
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </NavLink>
          <div className="px-6 py-6">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Dashboard</h2>
              {/* User profile dropdown could go here */}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
