/*
  # Digital Transformation Platform Schema

  1. New Tables
    - `users_profile`
      - Extended user profile information
      - Tracks credit balance and usage
    - `assessments`
      - Stores assessment data and results
    - `assessment_responses`
      - Individual assessment question responses
    - `recommendations`
      - AI-generated recommendations based on assessments
    
  2. Security
    - RLS enabled on all tables
    - Policies for user data protection
*/

-- Users Profile Table
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  credits integer DEFAULT 5,
  company_name text,
  industry text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  industry text NOT NULL,
  status text DEFAULT 'in_progress',
  score numeric(5,2),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT valid_status CHECK (status IN ('in_progress', 'completed'))
);

-- Assessment Responses Table
CREATE TABLE IF NOT EXISTS assessment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) NOT NULL,
  question_key text NOT NULL,
  response jsonb NOT NULL,
  score numeric(5,2),
  created_at timestamptz DEFAULT now()
);

-- Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  impact_score integer,
  complexity_score integer,
  estimated_cost numeric(10,2),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_impact CHECK (impact_score BETWEEN 1 AND 10),
  CONSTRAINT valid_complexity CHECK (complexity_score BETWEEN 1 AND 10)
);

-- Enable RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can read own profile" ON users_profile;
    DROP POLICY IF EXISTS "Users can update own profile" ON users_profile;
    DROP POLICY IF EXISTS "Users can read own assessments" ON assessments;
    DROP POLICY IF EXISTS "Users can create own assessments" ON assessments;
    DROP POLICY IF EXISTS "Users can read own responses" ON assessment_responses;
    DROP POLICY IF EXISTS "Users can read own recommendations" ON recommendations;
END $$;

-- Create RLS Policies
CREATE POLICY "Users can read own profile"
  ON users_profile FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own responses"
  ON assessment_responses FOR SELECT
  TO authenticated
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can read own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE user_id = auth.uid()
  ));