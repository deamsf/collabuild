/*
  # Project and Phase Management

  1. Changes
    - Enable RLS on projects table
    - Add policies for project management
    - Create phases table with RLS
    - Add policies for phase management
*/

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Users can read their projects" ON projects;
DROP POLICY IF EXISTS "Users can manage their projects" ON projects;

-- Create policies for project management
CREATE POLICY "Users can read their projects"
ON projects
FOR SELECT
TO authenticated
USING (
  auth.uid() = created_by
);

CREATE POLICY "Users can manage their projects"
ON projects
FOR ALL
TO authenticated
USING (
  auth.uid() = created_by
)
WITH CHECK (
  auth.uid() = created_by
);

-- Create phase status enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE phase_status AS ENUM ('not_started', 'in_progress', 'completed', 'delayed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create phases table
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  due_date timestamptz NOT NULL,
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status phase_status NOT NULL DEFAULT 'not_started',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on phases
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

-- Create policy for phase management
CREATE POLICY "Users can manage phases for their projects"
ON phases
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = phases.project_id
    AND projects.created_by = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = phases.project_id
    AND projects.created_by = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS projects_created_by_idx ON projects(created_by);
CREATE INDEX IF NOT EXISTS phases_project_id_idx ON phases(project_id);