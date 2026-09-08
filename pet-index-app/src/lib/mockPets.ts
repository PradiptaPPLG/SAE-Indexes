import { Pet } from '@/types/pet'

export const MOCK_PETS: Pet[] = [
  // Salju (Lvl 5)
  { id: 's1', name: 'Penguin', category: 'Bird', stock: 5, image_url: '/pets/1-salju-penguin.webp', description: 'Penguin lucu dari biome salju yang suka meluncur di atas es.', biome_level: 5, created_at: '', updated_at: '' },
  { id: 's2', name: 'Beruang Kutub', category: 'Other', stock: 5, image_url: '/pets/2-salju-beruang-kutub.webp', description: 'Beruang kutub raksasa dengan bulu tebal yang hangat.', biome_level: 5, created_at: '', updated_at: '' },
  { id: 's3', name: 'Walrus', category: 'Other', stock: 5, image_url: '/pets/2-salju-walrus.webp', description: 'Walrus besar dengan gading panjang dari biome salju.', biome_level: 5, created_at: '', updated_at: '' },
  { id: 's4', name: 'Macan Salju', category: 'Other', stock: 5, image_url: '/pets/3-salju-macan.webp', description: 'Macan tutul salju yang lincah dan tersembunyi di balik salju.', biome_level: 5, created_at: '', updated_at: '' },
  { id: 's5', name: 'Mamut', category: 'Other', stock: 5, image_url: '/pets/4-salju-mamut.webp', description: 'Mamut berbulu tebal dari zaman es yang perkasa.', biome_level: 5, created_at: '', updated_at: '' },
  { id: 's6', name: 'Raja Mamut', category: 'Other', stock: 5, image_url: '/pets/5-salju-raja-mamut.webp', description: 'Raja dari semua mamut — lebih besar, lebih kuat, dan lebih langka!', biome_level: 5, created_at: '', updated_at: '' },

  // Gunung Berapi (Lvl 6)
  { id: 'g1', name: 'Lava Gecko', category: 'Other', stock: 5, image_url: '/pets/1-gunung-berapi-gecko.webp', description: 'Gecko kecil yang hidup di sela-sela bebatuan lava membara.', biome_level: 6, created_at: '', updated_at: '' },
  { id: 'g2', name: 'Katak Api', category: 'Other', stock: 5, image_url: '/pets/2-gunung-berapi-katak.webp', description: 'Katak berwarna merah membara yang menyemburkan api dari mulutnya.', biome_level: 6, created_at: '', updated_at: '' },
  { id: 'g3', name: 'Banteng Lava', category: 'Other', stock: 5, image_url: '/pets/3-gunung-berapi-banteng.webp', description: 'Banteng besar dengan tanduk membara yang menghancurkan segalanya.', biome_level: 6, created_at: '', updated_at: '' },
  { id: 'g4', name: 'Iguana Lava', category: 'Other', stock: 5, image_url: '/pets/4-gunung-berapi-Iguana.webp', description: 'Iguana besar bersisik keras seperti batu vulkanik.', biome_level: 6, created_at: '', updated_at: '' },
  { id: 'g5', name: 'Chili Chill', category: 'Other', stock: 5, image_url: '/pets/5-gunung-berapi-chili-chill.webp', description: 'Makhluk pedas yang paradoks — panas di luar, dingin di dalam!', biome_level: 6, created_at: '', updated_at: '' },

  // Lautan Abyss (Lvl 7)
  { id: 'l1', name: 'Ikan Beo', category: 'Fish', stock: 5, image_url: '/pets/1-lautan-abyss-ikan-beo.webp', description: 'Ikan berwarna cerah yang hidup di kedalaman abyss dengan paruh keras.', biome_level: 7, created_at: '', updated_at: '' },
  { id: 'l2', name: 'Ikan Pedang', category: 'Fish', stock: 5, image_url: '/pets/2-lautan-abyss-ikan-pedang.webp', description: 'Ikan cepat dengan moncong tajam seperti pedang.', biome_level: 7, created_at: '', updated_at: '' },
  { id: 'l3', name: 'Hiu Abyss', category: 'Fish', stock: 5, image_url: '/pets/3-lautan-abyss-hiu.webp', description: 'Hiu misterius dari kedalaman gelap lautan abyss.', biome_level: 7, created_at: '', updated_at: '' },
  { id: 'l4', name: 'Orca', category: 'Fish', stock: 5, image_url: '/pets/4-lautan-abyss-orca.webp', description: 'Paus orca yang cerdas dan sosial, raja lautan abyss.', biome_level: 7, created_at: '', updated_at: '' },
  { id: 'l5', name: 'Paus', category: 'Fish', stock: 5, image_url: '/pets/5-lautan-abyss-paus.webp', description: 'Paus raksasa yang menguasai seluruh lautan abyss.', biome_level: 7, created_at: '', updated_at: '' },
  { id: 'l6', name: 'Beluga', category: 'Fish', stock: 5, image_url: '/pets/6-lautan-abyss-beluga.webp', description: 'Paus beluga putih bersih yang bersahabat dan cerdas.', biome_level: 7, created_at: '', updated_at: '' },

  // Prasejarah (Lvl 8)
  { id: 'p1', name: 'Dodo', category: 'Bird', stock: 5, image_url: '/pets/1-prasejarah-dodo.webp', description: 'Burung dodo legendaris yang sudah punah — kini hadir kembali!', biome_level: 8, created_at: '', updated_at: '' },
  { id: 'p2', name: 'Pterodactyl', category: 'Bird', stock: 5, image_url: '/pets/2-prasejarah-pterodactyl.webp', description: 'Reptil terbang prasejarah yang mendominasi langit jutaan tahun lalu.', biome_level: 8, created_at: '', updated_at: '' },
  { id: 'p3', name: 'Ankylosaurus', category: 'Other', stock: 5, image_url: '/pets/3-prasejarah-ankylosaurus.webp', description: 'Dinosaurus berzirah dengan ekor gada yang menghancurkan.', biome_level: 8, created_at: '', updated_at: '' },
  { id: 'p4', name: 'Triceratops', category: 'Other', stock: 5, image_url: '/pets/4-prasejarah-triceratops.webp', description: 'Dinosaurus bertanduk tiga yang gagah perkasa.', biome_level: 8, created_at: '', updated_at: '' },
  { id: 'p5', name: 'Brontosaurus', category: 'Other', stock: 5, image_url: '/pets/5-prasejarah-bronto.webp', description: 'Dinosaurus leher panjang terbesar di biome prasejarah.', biome_level: 8, created_at: '', updated_at: '' },

  // Kosmik (Lvl 9)
  { id: 'k1', name: 'Centipede Kosmik', category: 'Other', stock: 5, image_url: '/pets/1-kosmik-centipede.webp', description: 'Kelabang kosmik yang bergerak di antara dimensi luar angkasa.', biome_level: 9, created_at: '', updated_at: '' },
  { id: 'k2', name: 'Gecko Kosmik', category: 'Other', stock: 5, image_url: '/pets/2-kosmik-gecko.webp', description: 'Gecko yang tubuhnya dipenuhi bintang dan nebula.', biome_level: 9, created_at: '', updated_at: '' },
  { id: 'k3', name: 'Gorila Kosmik', category: 'Other', stock: 5, image_url: '/pets/3-kosmik-gorila.webp', description: 'Gorila raksasa yang melayang-layang di vakum luar angkasa.', biome_level: 9, created_at: '', updated_at: '' },
  { id: 'k4', name: 'Saturnita', category: 'Other', stock: 5, image_url: '/pets/4-kosmik-saturnita.webp', description: 'Makhluk misterius berbentuk planet Saturnus yang penuh teka-teki.', biome_level: 9, created_at: '', updated_at: '' },
]
