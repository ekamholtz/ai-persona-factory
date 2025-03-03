
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            PayTrak
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/#features" className="hover:text-primary/80 transition-colors">
              Features
            </Link>
            <Link to="/#pricing" className="hover:text-primary/80 transition-colors">
              Pricing
            </Link>
            <Link to="/" className="hover:text-primary/80 transition-colors">
              About
            </Link>
            {isLoggedIn ? (
              <Button className="hover-scale" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button className="hover-scale" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
