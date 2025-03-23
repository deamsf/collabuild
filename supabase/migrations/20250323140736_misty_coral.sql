/*
  # Project Access Policies

  1. Changes
    - Enable RLS on projects table
    - Add policy for authenticated users to read their own projects
    - Add policy for authenticated users to manage their own projects
*/

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Users can read their projects" ON projects;
DROP POLICY IF EXISTS "Users can manage their projects" ON projects;

-- Create policy for reading projects
CREATE POLICY "Users can read their projects"
ON projects
FOR SELECT
TO authenticated
USING (
  auth.uid() = created_by
);

-- Create policy for managing projects
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

-- Create index for faster lookups
CREATE INDEX projects_created_by_idx ON projects(created_by);