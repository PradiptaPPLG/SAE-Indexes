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
INSERT INTO pets (name, category, stock, image_url, description, biome_level) VALUES
  -- Salju (Lvl 5)
  ('Penguin', 'Bird',  5, '/pets/1-salju-penguin.webp',           'Penguin lucu dari biome salju yang suka meluncur di atas es.', 5),
  ('Beruang Kutub', 'Other', 5, '/pets/2-salju-beruang-kutub.webp', 'Beruang kutub raksasa dengan bulu tebal yang hangat.', 5),
  ('Walrus', 'Other',  5, '/pets/2-salju-walrus.webp',             'Walrus besar dengan gading panjang dari biome salju.', 5),
  ('Macan Salju', 'Other', 5, '/pets/3-salju-macan.webp',          'Macan tutul salju yang lincah dan tersembunyi di balik salju.', 5),
  ('Mamut', 'Other',  5, '/pets/4-salju-mamut.webp',              'Mamut berbulu tebal dari zaman es yang perkasa.', 5),
  ('Raja Mamut', 'Other', 5, '/pets/5-salju-raja-mamut.webp',     'Raja dari semua mamut — lebih besar, lebih kuat, dan lebih langka!', 5),

  -- Gunung Berapi (Lvl 6)
  ('Lava Gecko', 'Other', 5, '/pets/1-gunung-berapi-gecko.webp',  'Gecko kecil yang hidup di sela-sela bebatuan lava membara.', 6),
  ('Katak Api', 'Other', 5, '/pets/2-gunung-berapi-katak.webp',   'Katak berwarna merah membara yang menyemburkan api dari mulutnya.', 6),
  ('Banteng Lava', 'Other', 5, '/pets/3-gunung-berapi-banteng.webp', 'Banteng besar dengan tanduk membara yang menghancurkan segalanya.', 6),
  ('Iguana Lava', 'Other', 5, '/pets/4-gunung-berapi-Iguana.webp', 'Iguana besar bersisik keras seperti batu vulkanik.', 6),
  ('Chili Chill', 'Other', 5, '/pets/5-gunung-berapi-chili-chill.webp', 'Makhluk pedas yang paradoks — panas di luar, dingin di dalam!', 6),

  -- Lautan Abyss (Lvl 7)
  ('Ikan Beo', 'Fish', 5, '/pets/1-lautan-abyss-ikan-beo.webp',  'Ikan berwarna cerah yang hidup di kedalaman abyss dengan paruh keras.', 7),
  ('Ikan Pedang', 'Fish', 5, '/pets/2-lautan-abyss-ikan-pedang.webp', 'Ikan cepat dengan moncong tajam seperti pedang.', 7),
  ('Hiu Abyss', 'Fish', 5, '/pets/3-lautan-abyss-hiu.webp',      'Hiu misterius dari kedalaman gelap lautan abyss.', 7),
  ('Orca', 'Fish', 5, '/pets/4-lautan-abyss-orca.webp',          'Paus orca yang cerdas dan sosial, raja lautan abyss.', 7),
  ('Paus', 'Fish', 5, '/pets/5-lautan-abyss-paus.webp',          'Paus raksasa yang menguasai seluruh lautan abyss.', 7),
  ('Beluga', 'Fish', 5, '/pets/6-lautan-abyss-beluga.webp',      'Paus beluga putih bersih yang bersahabat dan cerdas.', 7),

  -- Prasejarah (Lvl 8)
  ('Dodo', 'Bird', 5, '/pets/1-prasejarah-dodo.webp',            'Burung dodo legendaris yang sudah punah — kini hadir kembali!', 8),
  ('Pterodactyl', 'Bird', 5, '/pets/2-prasejarah-pterodactyl.webp', 'Reptil terbang prasejarah yang mendominasi langit jutaan tahun lalu.', 8),
  ('Ankylosaurus', 'Other', 5, '/pets/3-prasejarah-ankylosaurus.webp', 'Dinosaurus berzirah dengan ekor gada yang menghancurkan.', 8),
  ('Triceratops', 'Other', 5, '/pets/4-prasejarah-triceratops.webp', 'Dinosaurus bertanduk tiga yang gagah perkasa.', 8),
  ('Brontosaurus', 'Other', 5, '/pets/5-prasejarah-bronto.webp', 'Dinosaurus leher panjang terbesar di biome prasejarah.', 8),

  -- Kosmik (Lvl 9)
  ('Centipede Kosmik', 'Other', 5, '/pets/1-kosmik-centipede.webp', 'Kelabang kosmik yang bergerak di antara dimensi luar angkasa.', 9),
  ('Gecko Kosmik', 'Other', 5, '/pets/2-kosmik-gecko.webp',      'Gecko yang tubuhnya dipenuhi bintang dan nebula.', 9),
  ('Gorila Kosmik', 'Other', 5, '/pets/3-kosmik-gorila.webp',    'Gorila raksasa yang melayang-layang di vakum luar angkasa.', 9),
  ('Saturnita', 'Other', 5, '/pets/4-kosmik-saturnita.webp',     'Makhluk misterius berbentuk planet Saturnus yang penuh teka-teki.');
