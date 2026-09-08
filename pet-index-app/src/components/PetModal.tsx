'use client'

import { useState, useEffect } from 'react'
import { Pet, PetInsert, PetUpdate } from '../../types/pet'

interface PetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (pet: PetInsert | PetUpdate) => Promise<void>
  initialData?: Pet
  title: string
}

export default function PetModal({ isOpen, onClose, onSave, initialData, title }: PetModalProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Cat')
  const [stock, setStock] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [biomeLevel, setBiomeLevel] = useState(5)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name)
      setCategory(initialData.category)
      setStock(initialData.stock)
      setImageUrl(initialData.image_url || '')
      setDescription(initialData.description || '')
      setBiomeLevel(initialData.biome_level)
    } else if (isOpen) {
      setName('')
      setCategory('Cat')
      setStock(0)
      setImageUrl('')
      setDescription('')
      setBiomeLevel(5)
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        name,
        category,
        stock,
        image_url: imageUrl || null,
        description: description || null,
        biome_level: biomeLevel
      }
      await onSave(data)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input 
              required
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Persian Cat"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Cat">Cat</option>
              <option value="Dog">Dog</option>
              <option value="Bird">Bird</option>
              <option value="Fish">Fish</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biome Level *</label>
            <select 
              value={biomeLevel} 
              onChange={e => setBiomeLevel(parseInt(e.target.value, 10))}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={5}>Lvl 5 - Salju</option>
              <option value={6}>Lvl 6 - Gunung Berapi</option>
              <option value={7}>Lvl 7 - Lautan Abyss</option>
              <option value={8}>Lvl 8 - Prasejarah</option>
              <option value={9}>Lvl 9 - Kosmik</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input 
              type="number" 
              min="0"
              value={stock} 
              onChange={e => setStock(Math.max(0, parseInt(e.target.value) || 0))} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input 
              type="url" 
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Hover Info)</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Fun facts about this pet..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex justify-center items-center"
            >
              {loading ? 'Saving...' : 'Save Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
