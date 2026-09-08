-- Supabase Schema for Pet Index App

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  description TEXT,
  biome_level INTEGER NOT NULL CHECK (biome_level >= 5 AND biome_level <= 9),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pets_updated_at
BEFORE UPDATE ON pets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (For this simple app, we can allow all access, but usually we restrict it)
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access"
ON pets FOR SELECT
TO anon
USING (true);

-- Allow anonymous insert access (for demo purposes)
CREATE POLICY "Allow anonymous insert access"
ON pets FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous update access (for demo purposes)
CREATE POLICY "Allow anonymous update access"
ON pets FOR UPDATE
TO anon
USING (true);

-- Allow anonymous delete access (for demo purposes)
CREATE POLICY "Allow anonymous delete access"
ON pets FOR DELETE
TO anon
USING (true);
