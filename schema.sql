-- Table: testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  video_url TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  section TEXT DEFAULT 'client_feedback',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: settings
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'টেস্টোমোনিয়াল হাব',
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  facebook TEXT,
  youtube TEXT,
  address TEXT,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings
INSERT INTO settings (id, email) VALUES (1, 'admin@example.com') ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access for testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access for settings" ON settings FOR SELECT USING (true);

-- Admin full access (assuming authenticated user is admin)
CREATE POLICY "Allow admin full access for testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access for settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Storage Bucket
-- Create a bucket named 'testimonials' in the Supabase dashboard.
-- Set public access to 'true' for the bucket if you want public URLs.
