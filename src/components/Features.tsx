
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Brain, Image, MessageSquare, Sparkles } from 'lucide-react';

const features = [
  {
    title: 'Personality Builder',
    description: 'Create unique AI personas with customizable traits, voice, and behavior patterns.',
    icon: Brain,
  },
  {
    title: 'Visual Generation',
    description: 'Generate high-quality images and videos that bring your persona to life.',
    icon: Image,
  },
  {
    title: 'Interactive Chat',
    description: 'Engage with your AI persona through natural conversations and interactions.',
    icon: MessageSquare,
  },
  {
    title: 'Smart Automation',
    description: 'Automate content creation and social media management with AI assistance.',
    icon: Sparkles,
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to create and manage sophisticated AI personas
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover-scale glass border-0">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
