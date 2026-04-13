-- Site Settings table for feature flags
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value BOOLEAN DEFAULT false,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert demo_mode flag (default OFF)
INSERT INTO site_settings (key, value, description)
VALUES ('demo_mode', false, 'When ON, shows demo dashboard to logged-in users instead of the real dashboard.')
ON CONFLICT (key) DO NOTHING;

-- Allow public read access (anon key can read settings)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_settings"
  ON site_settings
  FOR SELECT
  USING (true);

-- Only authenticated service_role can update (you do it from Supabase Dashboard)
CREATE POLICY "Only service role can update site_settings"
  ON site_settings
  FOR UPDATE
  USING (auth.role() = 'service_role');
