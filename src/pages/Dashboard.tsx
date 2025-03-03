
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Clock, CheckCircle, DollarSign, FileText, Plus } from 'lucide-react';

// Types for Profile and Projects
type Profile = {
  id: string;
  full_name: string;
  email: string;
  user_type: 'client' | 'contractor' | 'admin';
};

type Project = {
  id: string;
  name: string;
  status: 'draft' | 'in_progress' | 'completed';
  total_amount: number;
};

type Milestone = {
  id: string;
  name: string;
  project_id: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'paid';
  due_date: string;
};

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error("No user found");
          return;
        }
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        setProfile(profileData as Profile);
        
        // Get projects based on user type
        if (profileData.user_type === 'contractor') {
          // Get contractor's projects
          const { data: contractorData, error: contractorError } = await supabase
            .from('contractor_profiles')
            .select('id')
            .eq('id', user.id)
            .single();
          
          if (contractorError) throw contractorError;
          
          // Get projects for this contractor
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .eq('contractor_id', contractorData.id)
            .order('created_at', { ascending: false });
          
          if (projectsError) throw projectsError;
          setProjects(projectsData as Project[]);
          
          // Get recent milestones
          if (projectsData.length > 0) {
            const projectIds = projectsData.map(p => p.id);
            const { data: milestonesData, error: milestonesError } = await supabase
              .from('milestones')
              .select('*')
              .in('project_id', projectIds)
              .order('due_date', { ascending: true })
              .limit(5);
            
            if (milestonesError) throw milestonesError;
            setMilestones(milestonesData as Milestone[]);
          }
        } else if (profileData.user_type === 'client') {
          // Get client's projects
          const { data: clientProjectsData, error: clientProjectsError } = await supabase
            .from('project_clients')
            .select('project_id')
            .eq('client_id', user.id);
          
          if (clientProjectsError) throw clientProjectsError;
          
          if (clientProjectsData.length > 0) {
            const projectIds = clientProjectsData.map(p => p.project_id);
            
            // Get project details
            const { data: projectsData, error: projectsError } = await supabase
              .from('projects')
              .select('*')
              .in('id', projectIds)
              .order('created_at', { ascending: false });
            
            if (projectsError) throw projectsError;
            setProjects(projectsData as Project[]);
            
            // Get milestones
            const { data: milestonesData, error: milestonesError } = await supabase
              .from('milestones')
              .select('*')
              .in('project_id', projectIds)
              .order('due_date', { ascending: true })
              .limit(5);
            
            if (milestonesError) throw milestonesError;
            setMilestones(milestonesData as Milestone[]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const pendingMilestones = milestones.filter(m => m.status === 'pending' || m.status === 'in_progress');
  const completedMilestones = milestones.filter(m => m.status === 'completed' || m.status === 'paid');
  
  const totalProjectValue = projects.reduce((sum, project) => sum + (project.total_amount || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {profile?.full_name}</h1>
        {profile?.user_type === 'contractor' && (
          <Button asChild>
            <Link to="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeProjects} active projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProjectValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Milestones</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingMilestones.length}</div>
            <p className="text-xs text-muted-foreground">
              Milestones awaiting completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Milestones</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMilestones.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed tasks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No projects yet</p>
                {profile?.user_type === 'contractor' && (
                  <Button asChild>
                    <Link to="/dashboard/projects/new">Create Your First Project</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.slice(0, 4).map((project) => (
              <Link to={`/dashboard/projects/${project.id}`} key={project.id}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      <span className={`capitalize px-2 py-1 rounded-full text-xs 
                        ${project.status === 'draft' ? 'bg-gray-100' : 
                          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">${project.total_amount?.toFixed(2) || '0.00'}</span>
                      <span className="text-sm text-muted-foreground">View Details →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Milestones */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Milestones</h2>
        {milestones.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">No upcoming milestones</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {milestones.slice(0, 5).map((milestone) => (
                  <div key={milestone.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{milestone.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(milestone.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${milestone.amount.toFixed(2)}</p>
                        <span className={`capitalize px-2 py-1 rounded-full text-xs 
                          ${milestone.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-purple-100 text-purple-800'}`}>
                          {milestone.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
