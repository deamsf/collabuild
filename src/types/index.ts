export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
  };
  dark_mode: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  status: 'to-do' | 'in-progress' | 'done';
  phase: string;
  dueDate: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  project_id: string;
  name: string;
  email: string;
  company: string;
  role: 'landlord' | 'architect' | 'contractor';
  phases: string[];
  tags: string[];
  created_at: string;
}

export interface Resource {
  id: string;
  project_id: string;
  type: 'document' | 'photo' | 'financial';
  name: string;
  size: string;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  project_id: string;
  name: string;
  subject: string;
  description: string;
  last_modified: string;
  created_at: string;
}