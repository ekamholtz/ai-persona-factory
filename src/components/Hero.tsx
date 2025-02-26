
import React from 'react';
import { Button } from './ui/button';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-8 fade-in">
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary inline-block mb-4">
            Welcome to the Future of Digital Personas
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
            Create Your Perfect
            <span className="text-primary"> AI Persona</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Design and deploy sophisticated AI-powered digital personas for social media, marketing, entertainment, and more.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" className="hover-scale">
              Start Creating
            </Button>
            <Button variant="outline" size="lg" className="hover-scale">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
