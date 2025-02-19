/*
  # Update messages table RLS policies for public access

  1. Changes
    - Modified RLS policies to allow public access for reading and creating messages
    - Removed authentication requirement for better demo experience

  2. Security
    - Enable RLS on messages table
    - Add policies for public access to read and create messages
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public can read messages"
  ON messages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can create messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);