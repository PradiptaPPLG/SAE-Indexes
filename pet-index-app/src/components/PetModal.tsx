'use client'

import { useState, useEffect } from 'react'
import { Pet, PetInsert, PetUpdate } from '@/types/pet'
import { X, Upload, CheckCircle } from 'lucide-react'

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
  const [biomeLevel, setBiomeLevel] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name)
        setCategory(initialData.category)
        setStock(initialData.stock)
        setImageUrl(initialData.image_url || '')
        setBiomeLevel(initialData.biome_level)
        setFileName(initialData.image_url ? initialData.image_url.split('/').pop() || '' : '')
      } else {
        setName('')
        setCategory('Cat')
        setStock(0)
        setImageUrl('')
        setBiomeLevel(5)
        setFileName('')
      }
      setError('')
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi ekstensi .webp
    if (!file.name.toLowerCase().endsWith('.webp') && file.type !== 'image/webp') {
      setError('Format gambar WAJIB berformat .webp!')
      return
    }

    setError('')
    setFileName(file.name)

    // Convert file ke Data URL untuk disimpan/ditampilkan
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

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
        description: null,
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

        {error && <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

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

          {/* Image Upload (.webp required) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Upload Foto Pet <span className="text-red-500 font-bold">(Wajib .webp)</span>
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-500 transition-colors bg-gray-50/50">
              <input
                type="file"
                accept=".webp,image/webp"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                {fileName ? (
                  <>
                    <CheckCircle className="text-emerald-500" size={28} />
                    <span className="text-sm font-medium text-gray-800 line-clamp-1">{fileName}</span>
                    <span className="text-xs text-emerald-600 font-semibold">Format WebP Valid ✅</span>
                  </>
                ) : (
                  <>
                    <Upload className="text-gray-400" size={24} />
                    <span className="text-sm text-gray-600 font-medium">Klik untuk upload foto pet</span>
                    <span className="text-xs text-gray-400">Hanya menerima file <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800 font-bold">.webp</code></span>
                  </>
                )}
              </div>
            </div>
            {imageUrl && (
              <div className="mt-2 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm" />
                <span className="text-xs text-gray-500">Preview foto pet yang diupload</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
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
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-semibold transition-colors shadow"
            >
              {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Add Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

