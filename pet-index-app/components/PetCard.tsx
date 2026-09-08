'use client'

import { Pet } from '../types/pet'
import { Edit, Trash2 } from 'lucide-react'
import StockControl from './StockControl'
import clsx from 'clsx'
import Image from 'next/image'

interface PetCardProps {
  pet: Pet
  onEdit: (pet: Pet) => void
  onDelete: (pet: Pet) => void
  onUpdateStock: (pet: Pet, newStock: number) => void
}

export default function PetCard({ pet, onEdit, onDelete, onUpdateStock }: PetCardProps) {
  const isCrisis = pet.stock <= 3
  const isBoros = pet.stock > 6

  // Biome mapping
  const biomes: Record<number, string> = {
    5: 'Salju',
    6: 'Gunung Berapi',
    7: 'Lautan Abyss',
    8: 'Prasejarah',
    9: 'Kosmik'
  }

  const biomeName = biomes[pet.biome_level] || 'Unknown'

  return (
    <div className="group perspective-1000 w-full h-[400px]">
      <div className={clsx(
        "relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180",
        "rounded-xl shadow-lg border-2",
        isCrisis ? "border-red-500" : isBoros ? "border-blue-500" : "border-gray-200"
      )}>
        
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-xl overflow-hidden flex flex-col">
          {/* Status Badge */}
          {isCrisis && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
              🔴 KRISIS
            </div>
          )}
          {isBoros && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
              🔵 BOROS
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
            Lvl {pet.biome_level} {biomeName}
          </div>

          {/* Image */}
          <div className="relative h-48 bg-gray-100 flex-shrink-0">
            {pet.image_url ? (
              <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{pet.name}</h3>
            <p className="text-sm text-gray-500">{pet.category}</p>
            
            <div className="mt-auto pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className={clsx("font-semibold", isCrisis ? "text-red-500" : "text-gray-700")}>
                  Stock: {pet.stock}
                </span>
                <StockControl 
                  stock={pet.stock} 
                  onChange={(newStock) => onUpdateStock(pet, newStock)} 
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(pet)}
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit size={16} /> Edit
                </button>
                <button 
                  onClick={() => onDelete(pet)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card (Hover Info) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-800 text-white rounded-xl p-6 flex flex-col overflow-y-auto">
          <h3 className="font-bold text-xl mb-2">{pet.name}</h3>
          <div className="text-sm text-gray-300 mb-4 flex items-center gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded">{pet.category}</span>
            <span className="bg-gray-700 px-2 py-1 rounded">Lvl {pet.biome_level} {biomeName}</span>
          </div>
          <div className="prose prose-invert prose-sm">
            <p className="whitespace-pre-wrap">{pet.description || 'No additional information available for this pet.'}</p>
          </div>
        </div>

      </div>
    </div>
  )
}
