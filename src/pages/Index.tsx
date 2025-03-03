
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">The Payment Platform <br className="hidden md:inline" />for General Contractors</h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-muted-foreground">
              Streamline your payment processes, simplify project management, and delight your clients with our all-in-one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Contractors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Project Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create and manage projects, set milestones, and track progress all in one place.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Securely process payments, generate invoices, and track payment history.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Document Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Store, share, and manage all your project documents in a secure environment.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-muted">
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>For small contractors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2">
                    <li>Up to 5 projects</li>
                    <li>Basic document storage</li>
                    <li>Email support</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/auth">Start Free Trial</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-primary">
                <CardHeader className="bg-primary text-primary-foreground">
                  <CardTitle>Professional</CardTitle>
                  <CardDescription className="text-primary-foreground/90">For growing businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$79</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2">
                    <li>Unlimited projects</li>
                    <li>Advanced document management</li>
                    <li>Priority support</li>
                    <li>Team management</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/auth">Start Free Trial</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-muted">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For large contractors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$199</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2">
                    <li>Unlimited everything</li>
                    <li>QuickBooks integration</li>
                    <li>Dedicated account manager</li>
                    <li>Custom solutions</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/auth">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Streamline Your Business?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-primary-foreground/90">
              Join thousands of contractors who trust our platform to manage their projects and payments.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link to="/auth">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
