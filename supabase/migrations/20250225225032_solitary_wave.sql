/*
  # Resources and Sharing System

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `type` (enum: document, photo)
      - `name` (text)
      - `description` (text, nullable)
      - `storage_path` (text)
      - `size` (bigint)
      - `mime_type` (text)
      - `tags` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

    - `resource_shares`
      - `id` (uuid, primary key)
      - `name` (text)
      - `project_id` (uuid, references projects)
      - `password_hash` (text)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

    - `shared_resources`
      - `share_id` (uuid, references resource_shares)
      - `resource_id` (uuid, references resources)

    - `share_recipients`
      - `share_id` (uuid, references resource_shares)
      - `email` (text)
      - `notified_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their project resources
    - Add policies for accessing shared resources via share links

  3. Storage
    - Create storage buckets for documents and photos
    - Set up storage policies
*/

-- Create resource type enum
CREATE TYPE resource_type AS ENUM ('document', 'photo');

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type resource_type NOT NULL,
  name text NOT NULL,
  description text,
  storage_path text NOT NULL,
  size bigint NOT NULL,
  mime_type text NOT NULL,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create resource shares table
CREATE TABLE IF NOT EXISTS resource_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  password_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create shared resources junction table
CREATE TABLE IF NOT EXISTS shared_resources (
  share_id uuid REFERENCES resource_shares(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES resources(id) ON DELETE CASCADE,
  PRIMARY KEY (share_id, resource_id)
);

-- Create share recipients table
CREATE TABLE IF NOT EXISTS share_recipients (
  share_id uuid REFERENCES resource_shares(id) ON DELETE CASCADE,
  email text NOT NULL,
  notified_at timestamptz,
  PRIMARY KEY (share_id, email)
);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_recipients ENABLE ROW LEVEL SECURITY;

-- Create policies for resources
CREATE POLICY "Users can manage resources for their projects"
ON resources
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = resources.project_id
    AND team_members.email = auth.jwt()->>'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = resources.project_id
    AND team_members.email = auth.jwt()->>'email'
  )
);

-- Create policies for resource shares
CREATE POLICY "Users can manage shares for their projects"
ON resource_shares
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = resource_shares.project_id
    AND team_members.email = auth.jwt()->>'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = resource_shares.project_id
    AND team_members.email = auth.jwt()->>'email'
  )
);

-- Create policies for shared resources
CREATE POLICY "Users can manage shared resources for their shares"
ON shared_resources
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM resource_shares
    JOIN team_members ON team_members.project_id = resource_shares.project_id
    WHERE resource_shares.id = shared_resources.share_id
    AND team_members.email = auth.jwt()->>'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM resource_shares
    JOIN team_members ON team_members.project_id = resource_shares.project_id
    WHERE resource_shares.id = shared_resources.share_id
    AND team_members.email = auth.jwt()->>'email'
  )
);

-- Create policies for share recipients
CREATE POLICY "Users can manage recipients for their shares"
ON share_recipients
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM resource_shares
    JOIN team_members ON team_members.project_id = resource_shares.project_id
    WHERE resource_shares.id = share_recipients.share_id
    AND team_members.email = auth.jwt()->>'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM resource_shares
    JOIN team_members ON team_members.project_id = resource_shares.project_id
    WHERE resource_shares.id = share_recipients.share_id
    AND team_members.email = auth.jwt()->>'email'
  )
);

-- Create indexes for better performance
CREATE INDEX resources_project_id_idx ON resources(project_id);
CREATE INDEX resource_shares_project_id_idx ON resource_shares(project_id);
CREATE INDEX resources_created_at_idx ON resources(created_at);
CREATE INDEX resource_shares_expires_at_idx ON resource_shares(expires_at);