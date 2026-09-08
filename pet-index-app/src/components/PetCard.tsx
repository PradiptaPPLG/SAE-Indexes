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

const BIOMES: Record<number, { name: string; emoji: string; color: string }> = {
  5: { name: 'Salju', emoji: '🌨️', color: 'bg-sky-100 text-sky-800' },
  6: { name: 'Gunung Berapi', emoji: '🌋', color: 'bg-orange-100 text-orange-800' },
  7: { name: 'Lautan Abyss', emoji: '🌊', color: 'bg-indigo-100 text-indigo-800' },
  8: { name: 'Prasejarah', emoji: '🦕', color: 'bg-amber-100 text-amber-800' },
  9: { name: 'Kosmik', emoji: '🌌', color: 'bg-violet-100 text-violet-800' },
}

export default function PetCard({ pet, onEdit, onDelete, onUpdateStock }: PetCardProps) {
  const isCrisis = pet.stock <= 3
  const isBoros = pet.stock > 6
  const biome = BIOMES[pet.biome_level] || { name: 'Unknown', emoji: '❓', color: 'bg-gray-100 text-gray-800' }

  const borderClass = isCrisis
    ? 'border-red-500 shadow-red-100'
    : isBoros
    ? 'border-blue-400 shadow-blue-100'
    : 'border-gray-200 shadow-gray-100'

  return (
    <div className="group perspective-1000 w-full" style={{ height: '420px' }}>
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180 rounded-2xl border-2 shadow-lg ${borderClass}`}
      >
        {/* ── FRONT ── */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-2xl overflow-hidden flex flex-col">

          {/* Crisis / Boros badge */}
          {isCrisis && (
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              🔴 KRISIS
            </div>
          )}
          {!isCrisis && isBoros && (
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              🔵 BOROS
            </div>
          )}

          {/* Biome badge */}
          <div className={`absolute top-2 right-2 z-10 text-xs font-semibold px-2 py-1 rounded-full shadow ${biome.color}`}>
            {biome.emoji} Lvl {pet.biome_level}
          </div>

          {/* Image */}
          <div className="relative h-44 bg-gray-100 flex-shrink-0">
            {pet.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                <span className="text-5xl">{biome.emoji}</span>
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow overflow-hidden">
            <h3 className="font-bold text-base text-gray-900 leading-tight line-clamp-1">{pet.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{pet.category} · {biome.emoji} {biome.name}</p>

            <div className="mt-auto pt-3 space-y-3">
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
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded-lg transition-colors text-xs font-medium"
                >
                  <Edit size={13} /> Edit
                </button>
                <button
                  onClick={() => onDelete(pet)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg transition-colors text-xs font-medium"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── BACK (flip info) ── */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}
        >
          {/* Biome header */}
          <div className="px-5 pt-5 pb-3 border-b border-white/10 flex items-center gap-3">
            <span className="text-4xl">{biome.emoji}</span>
            <div>
              <p className="text-white/60 text-xs">Lvl {pet.biome_level} · {biome.name}</p>
              <h3 className="text-white font-bold text-lg leading-tight">{pet.name}</h3>
            </div>
          </div>

          {/* Category + stock */}
          <div className="px-5 py-2 flex gap-2">
            <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full">{pet.category}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${isCrisis ? 'bg-red-500 text-white' : isBoros ? 'bg-blue-500 text-white' : 'bg-green-600 text-white'}`}>
              Stock: {pet.stock}
            </span>
          </div>

          {/* Description */}
          <div className="px-5 pb-5 flex-grow overflow-y-auto">
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {pet.description || 'No description available for this pet. Hover is showing you the flip card info!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
