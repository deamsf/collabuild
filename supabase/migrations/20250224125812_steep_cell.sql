/*
  # Fix project access policies

  1. Security
    - Enable RLS on projects table
    - Add policy for authenticated users to read projects they are members of
    - Remove recursive policy that was causing infinite recursion
*/

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Users can read their projects" ON projects;

-- Create a new, simpler policy for project access
CREATE POLICY "Users can read their projects"
ON projects
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = projects.id
    AND team_members.email = auth.jwt()->>'email'
  )
);