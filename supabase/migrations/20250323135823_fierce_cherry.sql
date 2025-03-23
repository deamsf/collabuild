/*
  # Create phases table

  1. New Tables
    - `phases`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `name` (text)
      - `description` (text)
      - `start_date` (timestamptz)
      - `due_date` (timestamptz)
      - `progress` (integer)
      - `status` (enum: not_started, in_progress, completed, delayed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `phases` table
    - Add policy for authenticated users to manage their project phases
*/

-- Create phase status enum
CREATE TYPE phase_status AS ENUM ('not_started', 'in_progress', 'completed', 'delayed');

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

-- Enable RLS
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

-- Create policy for phase management
CREATE POLICY "Users can manage phases for their projects"
ON phases
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = phases.project_id
    AND team_members.email = auth.jwt()->>'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = phases.project_id
    AND team_members.email = auth.jwt()->>'email'
  )
);

-- Create index for faster lookups
CREATE INDEX phases_project_id_idx ON phases(project_id);