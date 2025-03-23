-- Create team_members table first
CREATE TABLE IF NOT EXISTS team_members (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'member')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, email)
);

-- Enable RLS on team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Enable RLS on projects
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

-- Create policy for team members management
CREATE POLICY "Users can manage team members"
ON team_members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = team_members.project_id
    AND team_members.email = auth.jwt()->>'email'
    AND team_members.role = 'owner'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = team_members.project_id
    AND team_members.email = auth.jwt()->>'email'
    AND team_members.role = 'owner'
  )
);

-- Create index for faster lookups
CREATE INDEX team_members_email_idx ON team_members(email);