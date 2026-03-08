---create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  created_at timestamp default now()
);




-- 1. SCHOOL SETTINGS TABLE
-- This stores the global "brain" of your website.
CREATE TABLE IF NOT EXISTS school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT DEFAULT 'Brightside Academy',
  motto TEXT DEFAULT 'Aiming for Excellence',
  about TEXT,
  phone TEXT DEFAULT '+254 000 000 000',
  email TEXT DEFAULT 'info@brightside.com',
  primary_color TEXT DEFAULT '#1e40af',
  logo_url TEXT,
  hero_bg_url TEXT,         -- New: Optional Hero Image
  about_image_url TEXT,     -- New: About Us Image
  map_url TEXT,             -- New: Google Maps Embed Link
  notice_text TEXT,         -- New: Notice Board Content
  show_notice BOOLEAN DEFAULT true, -- New: Notice Toggle
  notice_expires_at TIMESTAMP WITH TIME ZONE -- New: Auto-hide Date
);

-- 2. DOWNLOADS TABLE
-- For PDFs, Newsletters, and Forms.
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. SITE SECTIONS TABLE
-- Stores content for the Modals (Admissions, Events, etc.)
CREATE TABLE IF NOT EXISTS site_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- 'admissions', 'events', 'extra-curricular'
  title TEXT NOT NULL,
  content TEXT
);

-- 4. AUTHORIZED ADMINS TABLE
-- The "Gatekeeper" for Google Auth login.
CREATE TABLE IF NOT EXISTS authorized_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. INITIAL DATA
-- Insert a starting row so the website doesn't crash on first load.
INSERT INTO school_settings (school_name, motto) 
VALUES ('Brightside Academy', 'Aiming for Excellence')
ON CONFLICT DO NOTHING;

-- Insert your admin email (CHANGE THIS to your actual Gmail address!)
INSERT INTO authorized_admins (email) 
VALUES ('your-email@gmail.com');

-- 6. SECURITY (Row Level Security - RLS)
-- Allows the public to VIEW your site, but only Admins to EDIT.
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorized_admins ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Public Read Settings" ON school_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Downloads" ON downloads FOR SELECT USING (true);
CREATE POLICY "Public Read Sections" ON site_sections FOR SELECT USING (true);

-- Allow Authorized Admins to do EVERYTHING (Insert, Update, Delete)
-- Note: This assumes you have authenticated via Supabase Auth
CREATE POLICY "Admins full access" ON school_settings FOR ALL USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM authorized_admins)
);
