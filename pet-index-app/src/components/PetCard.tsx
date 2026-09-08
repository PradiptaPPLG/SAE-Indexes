'use client'

import { Pet } from '@/types/pet'
import { Edit, Trash2 } from 'lucide-react'
import StockControl from '@/components/StockControl'

interface PetCardProps {
  pet: Pet
  onEdit: (pet: Pet) => void
  onDelete: (pet: Pet) => void
  onUpdateStock: (pet: Pet, newStock: number) => void
}

const INFO_HOVER_MAP: Record<string, string> = {
  'Penguin': '/info/penguin.webp',
  'Beruang Kutub': '/info/beruang-kutub.webp',
  'Walrus': '/info/walrus.webp',
  'Macan Salju': '/info/macan.webp',
  'Mamut': '/info/mamut.webp',
  'Raja Mamut': '/info/raja-mamut.webp',
  'Lava Gecko': '/info/lava-gecko.webp',
  'Katak Api': '/info/katak.webp',
  'Banteng Lava': '/info/banteng.webp',
  'Iguana Lava': '/info/iguana.webp',
  'Chili Chill': '/info/chili.webp',
  'Ikan Beo': '/info/beo.webp',
  'Ikan Pedang': '/info/pedang.webp',
  'Hiu Abyss': '/info/hiu.webp',
  'Orca': '/info/orca.webp',
  'Paus': '/info/paus.webp',
  'Beluga': '/info/beluga.webp',
  'Dodo': '/info/dodo.webp',
  'Pterodactyl': '/info/pterodactyl.webp',
  'Ankylosaurus': '/info/ankylosaurus.webp',
  'Triceratops': '/info/triceratops.webp',
  'Brontosaurus': '/info/bronto.webp',
  'Centipede Kosmik': '/info/centipede.webp',
  'Gecko Kosmik': '/info/kosmik-gecko.webp',
  'Gorila Kosmik': '/info/gorila.webp',
  'Saturnita': '/info/saturnus.webp',
}

const BIOMES: Record<number, { 
  name: string
  emoji: string
  badgeBg: string
  cardBg: string
  cardBorder: string
}> = {
  5: { 
    name: 'Salju', 
    emoji: '🌨️', 
    badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    cardBg: 'bg-gradient-to-br from-cyan-50/70 via-sky-50/40 to-blue-50/60',
    cardBorder: 'border-cyan-300',
  },
  6: { 
    name: 'Gunung Berapi', 
    emoji: '🌋', 
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    cardBg: 'bg-gradient-to-br from-orange-50/70 via-amber-50/40 to-red-50/60',
    cardBorder: 'border-orange-300',
  },
  7: { 
    name: 'Lautan Abyss', 
    emoji: '🌊', 
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
    cardBg: 'bg-gradient-to-br from-slate-100/70 via-blue-50/40 to-indigo-50/60',
    cardBorder: 'border-blue-300',
  },
  8: { 
    name: 'Prasejarah', 
    emoji: '🦕', 
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    cardBg: 'bg-gradient-to-br from-amber-50/80 via-yellow-50/40 to-orange-50/50',
    cardBorder: 'border-amber-400',
  },
  9: { 
    name: 'Kosmik', 
    emoji: '🌌', 
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
    cardBg: 'bg-gradient-to-br from-purple-50/70 via-violet-50/40 to-fuchsia-50/50',
    cardBorder: 'border-purple-300',
  },
}

export default function PetCard({ pet, onEdit, onDelete, onUpdateStock }: PetCardProps) {
  const isCrisis = pet.stock <= 3
  const isBoros = pet.stock > 6
  const biome = BIOMES[pet.biome_level] || { 
    name: 'Unknown', 
    emoji: '❓', 
    badgeBg: 'bg-gray-100 text-gray-800 border-gray-200', 
    cardBg: 'bg-white', 
    cardBorder: 'border-gray-200',
  }

  const infoHoverImage = INFO_HOVER_MAP[pet.name]

  const borderClass = isCrisis
    ? 'border-red-500 shadow-red-100 ring-2 ring-red-400/20'
    : isBoros
    ? 'border-blue-500 shadow-blue-100 ring-2 ring-blue-400/20'
    : `${biome.cardBorder} shadow-gray-100`

  return (
    <div className={`w-full rounded-2xl border-2 shadow-lg overflow-hidden flex flex-col ${borderClass} ${biome.cardBg}`} style={{ height: '420px' }}>
      
      {/* ── IMAGE SECTION WITH FLIP ON HOVER ── */}
      <div className="group perspective-1000 relative h-48 flex-shrink-0 cursor-pointer">
        
        {/* Crisis / Boros badge */}
        {isCrisis && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            🔴 KRISIS
          </div>
        )}
        {!isCrisis && isBoros && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            🔵 BOROS
          </div>
        )}

        {/* Biome badge */}
        <div className={`absolute top-2 right-2 z-20 text-xs font-semibold px-2 py-1 rounded-full shadow border ${biome.badgeBg}`}>
          {biome.emoji} Lvl {pet.biome_level}
        </div>

        {/* 3D Flip Container for Image Area */}
        <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
          
          {/* FRONT: Main Pet Image */}
          <div className="absolute inset-0 backface-hidden bg-gray-100 flex items-center justify-center overflow-hidden">
            {pet.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <span className="text-5xl">{biome.emoji}</span>
                <span className="text-xs">No Image</span>
              </div>
            )}
            <div className="absolute bottom-1 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded opacity-80 backdrop-blur-xs">
              Hover info ↺
            </div>
          </div>

          {/* BACK: Info Hover Image from info-hover folder */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-900 flex items-center justify-center overflow-hidden">
            {infoHoverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={infoHoverImage} alt={`${pet.name} Info`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/70 p-4 text-center">
                <span className="text-3xl">{biome.emoji}</span>
                <span className="text-xs font-bold mt-1">{pet.name}</span>
                <span className="text-[10px] text-white/50">Info image not found</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── CARD BOTTOM CONTENT ── */}
      <div className="p-4 flex flex-col flex-grow justify-between overflow-hidden">
        <div>
          <h3 className="font-bold text-base text-gray-900 leading-tight line-clamp-1">{pet.name}</h3>
          <p className="text-xs text-gray-600 mt-0.5">{pet.category} · {biome.emoji} {biome.name}</p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Stock label */}
          <div className={`text-sm font-semibold ${isCrisis ? 'text-red-500' : isBoros ? 'text-blue-600' : 'text-gray-700'}`}>
            Stock: {pet.stock}
          </div>

          {/* Stock controls */}
          <StockControl stock={pet.stock} onChange={(n) => onUpdateStock(pet, n)} />

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(pet)}
              className="flex-1 flex items-center justify-center gap-1 bg-white/80 hover:bg-white text-gray-700 py-1.5 rounded-lg transition-colors text-xs font-medium border border-gray-200 shadow-sm"
            >
              <Edit size={13} /> Edit
            </button>
            <button
              onClick={() => onDelete(pet)}
              className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg transition-colors text-xs font-medium border border-red-100"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}


