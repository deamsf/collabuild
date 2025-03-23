/*
  # Add assignee_id to tasks table

  1. Changes
    - Add assignee_id column to tasks table
    - Add foreign key constraint to auth.users
*/

-- Add assignee_id column to tasks table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'assignee_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;