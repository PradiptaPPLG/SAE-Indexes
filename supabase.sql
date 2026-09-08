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

-- ============================================================
-- SEED DATA — 26 Pets (dari folder pet-index)
-- Biome: Salju=5, Gunung Berapi=6, Lautan Abyss=7, Prasejarah=8, Kosmik=9
-- ============================================================
INSERT INTO pets (name, category, stock, image_url, biome_level) VALUES
  -- Salju (Lvl 5)
  ('Penguin',      'Bird',  5, '/pets/1-salju-penguin.webp',              5),
  ('Beruang Kutub','Other', 5, '/pets/2-salju-beruang-kutub.webp',        5),
  ('Walrus',       'Other', 5, '/pets/2-salju-walrus.webp',               5),
  ('Macan Salju',  'Other', 5, '/pets/3-salju-macan.webp',                5),
  ('Mamut',        'Other', 5, '/pets/4-salju-mamut.webp',                5),
  ('Raja Mamut',   'Other', 5, '/pets/5-salju-raja-mamut.webp',           5),

  -- Gunung Berapi (Lvl 6)
  ('Lava Gecko',   'Other', 5, '/pets/1-gunung-berapi-gecko.webp',        6),
  ('Katak Api',    'Other', 5, '/pets/2-gunung-berapi-katak.webp',        6),
  ('Banteng Lava', 'Other', 5, '/pets/3-gunung-berapi-banteng.webp',      6),
  ('Iguana Lava',  'Other', 5, '/pets/4-gunung-berapi-Iguana.webp',       6),
  ('Chili Chill',  'Other', 5, '/pets/5-gunung-berapi-chili-chill.webp',  6),

  -- Lautan Abyss (Lvl 7)
  ('Ikan Beo',     'Fish',  5, '/pets/1-lautan-abyss-ikan-beo.webp',      7),
  ('Ikan Pedang',  'Fish',  5, '/pets/2-lautan-abyss-ikan-pedang.webp',   7),
  ('Hiu Abyss',    'Fish',  5, '/pets/3-lautan-abyss-hiu.webp',           7),
  ('Orca',         'Fish',  5, '/pets/4-lautan-abyss-orca.webp',          7),
  ('Paus',         'Fish',  5, '/pets/5-lautan-abyss-paus.webp',          7),
  ('Beluga',       'Fish',  5, '/pets/6-lautan-abyss-beluga.webp',        7),

  -- Prasejarah (Lvl 8)
  ('Dodo',         'Bird',  5, '/pets/1-prasejarah-dodo.webp',            8),
  ('Pterodactyl',  'Bird',  5, '/pets/2-prasejarah-pterodactyl.webp',     8),
  ('Ankylosaurus', 'Other', 5, '/pets/3-prasejarah-ankylosaurus.webp',    8),
  ('Triceratops',  'Other', 5, '/pets/4-prasejarah-triceratops.webp',     8),
  ('Brontosaurus', 'Other', 5, '/pets/5-prasejarah-bronto.webp',          8),

  -- Kosmik (Lvl 9)
  ('Centipede Kosmik', 'Other', 5, '/pets/1-kosmik-centipede.webp',       9),
  ('Gecko Kosmik',     'Other', 5, '/pets/2-kosmik-gecko.webp',           9),
  ('Gorila Kosmik',    'Other', 5, '/pets/3-kosmik-gorila.webp',          9),
  ('Saturnita',        'Other', 5, '/pets/4-kosmik-saturnita.webp',       9);

