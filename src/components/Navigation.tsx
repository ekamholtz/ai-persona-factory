
import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            AI Creator
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/" className="hover:text-primary/80 transition-colors">
              Features
            </Link>
            <Link to="/" className="hover:text-primary/80 transition-colors">
              Pricing
            </Link>
            <Link to="/" className="hover:text-primary/80 transition-colors">
              About
            </Link>
            <Button className="hover-scale">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
