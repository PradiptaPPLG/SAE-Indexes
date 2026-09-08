'use client'

import { useState, useEffect } from 'react'
import { Pet, PetInsert, PetUpdate } from '@/types/pet'
import { X } from 'lucide-react'

interface PetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (pet: PetInsert | PetUpdate) => Promise<void>
  initialData?: Pet
  title: string
}

const BIOME_OPTIONS = [
  { value: 5, label: '🌨️ Lvl 5 - Salju' },
  { value: 6, label: '🌋 Lvl 6 - Gunung Berapi' },
  { value: 7, label: '🌊 Lvl 7 - Lautan Abyss' },
  { value: 8, label: '🦕 Lvl 8 - Prasejarah' },
  { value: 9, label: '🌌 Lvl 9 - Kosmik' },
]

const CATEGORIES = ['Cat', 'Dog', 'Bird', 'Fish', 'Other']

export default function PetModal({ isOpen, onClose, onSave, initialData, title }: PetModalProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Cat')
  const [stock, setStock] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [biomeLevel, setBiomeLevel] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name)
        setCategory(initialData.category)
        setStock(initialData.stock)
        setImageUrl(initialData.image_url || '')
        setDescription(initialData.description || '')
        setBiomeLevel(initialData.biome_level)
      } else {
        setName('')
        setCategory('Cat')
        setStock(0)
        setImageUrl('')
        setDescription('')
        setBiomeLevel(5)
      }
      setError('')
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required.'); return }
    setError('')
    setLoading(true)
    try {
      await onSave({
        name: name.trim(),
        category,
        stock,
        image_url: imageUrl.trim() || null,
        description: description.trim() || null,
        biome_level: biomeLevel,
      })
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError('Failed to save: ' + message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
            <input
              required
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Persian Cat"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Biome Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Biome Level *</label>
            <select
              value={biomeLevel}
              onChange={e => setBiomeLevel(parseInt(e.target.value, 10))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white"
            >
              {BIOME_OPTIONS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Stock</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={e => setStock(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description <span className="font-normal text-gray-400">(shown on card hover)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Fun facts, habitat info, special abilities..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Add Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
