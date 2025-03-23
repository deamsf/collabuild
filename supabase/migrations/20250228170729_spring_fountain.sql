/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `title` (text)
      - `description` (text)
      - `status` (task status enum)
      - `author_id` (uuid, foreign key to auth.users)
      - `assignee_id` (uuid, foreign key to auth.users)
      - `due_date` (timestamptz)
      - `completion_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `tasks` table
    - Add policy for authenticated users to manage tasks for their projects
*/

-- Create task status enum
CREATE TYPE task_status AS ENUM (
  'not_yet',
  'to_do',
  'in_progress',
  'waiting',
  'done',
  'canceled'
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status task_status NOT NULL DEFAULT 'not_yet',
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date timestamptz,
  completion_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for task management
CREATE POLICY "Users can manage tasks for their projects"
ON tasks
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = tasks.project_id
    AND team_members.email = auth.jwt()->>'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = tasks.project_id
    AND team_members.email = auth.jwt()->>'email'
  )
);

-- Create indexes for better performance
CREATE INDEX tasks_project_id_idx ON tasks(project_id);
CREATE INDEX tasks_status_idx ON tasks(status);
CREATE INDEX tasks_due_date_idx ON tasks(due_date);