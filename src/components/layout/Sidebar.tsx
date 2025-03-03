
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Plus, 
  Image, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Create Avatar",
      icon: Plus,
      href: "/create",
    },
    {
      title: "Gallery",
      icon: Image,
      href: "/gallery",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];
  
  return (
    <div
      className={cn(
        "relative group bg-background flex flex-col border-r transition-all duration-300",
        collapsed ? "w-14" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 -right-4 h-8 w-8 rounded-full border bg-background shadow-md hidden md:flex"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>
      
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive(item.href) && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
      
      {!collapsed && (
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Sparkles size={16} />
            Get Premium
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
