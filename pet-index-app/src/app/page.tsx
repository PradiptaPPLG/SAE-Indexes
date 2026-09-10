'use client'

import { useState, useEffect, useMemo } from 'react'
import { databases, DATABASE_ID, COLLECTION_ID, ID, Query } from '@/lib/appwrite'
import { Pet, PetInsert, PetUpdate } from '@/types/pet'
import { MOCK_PETS } from '@/lib/mockPets'
import PetCard from '@/components/PetCard'
import PetModal from '@/components/PetModal'
import { Plus, Search } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [useMock, setUseMock] = useState(false)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | undefined>(undefined)

  // Fetch pets initially and set up real-time (optional, here we just fetch)
  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    setLoading(true)
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.orderAsc('biome_level'),
          Query.orderAsc('name'),
          Query.limit(500),
        ]
      )

      if (!response.documents || response.documents.length === 0) {
        setPets(MOCK_PETS)
        setUseMock(true)
      } else {
        // Remap Appwrite fields ($id, $createdAt, $updatedAt) → Pet type
        const mapped: Pet[] = response.documents.map((doc) => ({
          id: doc.$id,
          name: doc.name,
          category: doc.category,
          stock: doc.stock,
          image_url: doc.image_url ?? null,
          description: doc.description ?? null,
          biome_level: doc.biome_level,
          created_at: doc.$createdAt,
          updated_at: doc.$updatedAt,
        }))
        setPets(mapped)
        setUseMock(false)
      }
    } catch (error) {
      console.warn('Appwrite error, using mock data:', error)
      setPets(MOCK_PETS)
      setUseMock(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePet = async (petData: PetInsert | PetUpdate) => {
    if (useMock) {
      // Mock mode: update local state only
      if (editingPet) {
        setPets(prev => prev.map(p => p.id === editingPet.id ? { ...p, ...petData } : p))
        toast.success('Pet updated! (mode mock — belum tersambung Supabase)')
      } else {
        const newPet: Pet = { id: `mock-${Date.now()}`, created_at: '', updated_at: '', ...(petData as PetInsert) }
        setPets(prev => [...prev, newPet])
        toast.success('Pet added! (mode mock — belum tersambung Supabase)')
      }
      return
    }
    if (editingPet) {
      // Update
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        editingPet.id,
        petData as Record<string, unknown>
      )
      toast.success('Pet updated!')
    } else {
      // Insert
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        petData as Record<string, unknown>
      )
      toast.success('Pet added!')
    }
    await fetchPets()
  }

  const handleDeletePet = async (pet: Pet) => {
    if (confirm(`Delete ${pet.name}? This action cannot be undone.`)) {
      if (useMock) {
        setPets(prev => prev.filter(p => p.id !== pet.id))
        toast.success('Pet deleted (mode mock)')
        return
      }
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, pet.id)
        toast.success('Pet deleted')
        await fetchPets()
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        toast.error('Failed to delete pet: ' + msg)
      }
    }
  }

  const handleUpdateStock = async (pet: Pet, newStock: number) => {
    // Optimistic UI update
    setPets(prev => prev.map(p => p.id === pet.id ? { ...p, stock: newStock } : p))
    
    if (useMock) return // In mock mode, just keep the optimistic update
    
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        pet.id,
        { stock: newStock }
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toast.error('Failed to update stock: ' + msg)
      await fetchPets() // revert
    }
  }

  // Filter and group pets
  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || pet.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [pets, searchQuery, categoryFilter])

  const { crisisPets, normalPets, borosPets } = useMemo(() => {
    const crisis: Pet[] = []
    const normal: Pet[] = []
    const boros: Pet[] = []

    filteredPets.forEach(pet => {
      if (pet.stock <= 3) crisis.push(pet)
      else if (pet.stock > 6) boros.push(pet)
      else normal.push(pet)
    })

    // They are already sorted by biome_level and name from the DB query
    // But since we are updating state optimistically, let's ensure sorting is maintained
    const sortFn = (a: Pet, b: Pet) => {
      if (a.biome_level !== b.biome_level) return a.biome_level - b.biome_level
      return a.name.localeCompare(b.name)
    }

    return {
      crisisPets: crisis.sort(sortFn),
      normalPets: normal.sort(sortFn),
      borosPets: boros.sort(sortFn)
    }
  }, [filteredPets])

  const categories = ['All', 'Cat', 'Dog', 'Bird', 'Fish', 'Other']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 text-gray-900 pb-20 font-sans selection:bg-blue-200">
      <Toaster position="bottom-right" toastOptions={{ className: 'rounded-xl shadow-lg font-medium text-sm' }} />
      
      {/* Header & Controls */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <span className="text-xl font-black tracking-tighter">PI</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                Pet Index
              </h1>
            </div>
            
            <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search your pets..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white shadow-sm transition-all text-sm font-medium placeholder:text-gray-400"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="py-2.5 px-4 bg-white/60 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white shadow-sm transition-all text-sm font-semibold text-slate-700 cursor-pointer appearance-none min-w-[100px]"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <button
                onClick={() => { setEditingPet(undefined); setIsModalOpen(true); }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:-translate-y-0.5"
              >
                <Plus size={18} strokeWidth={3} /> <span className="hidden sm:inline tracking-wide">Add Pet</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mock mode banner */}
      {useMock && (
        <div className="bg-amber-100/80 backdrop-blur-sm border-b border-amber-200/50 text-amber-900 text-xs sm:text-sm px-4 py-3 text-center font-medium shadow-inner flex items-center justify-center gap-2">
          <span className="text-lg">⚠️</span> 
          <span>Mode Demo Aktif — Menggunakan data lokal. Pastikan kredensial Appwrite di <code className="bg-amber-200/70 px-1.5 py-0.5 rounded-md font-mono text-xs">.env.local</code> sudah benar.</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400 space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="font-medium tracking-wide">Memuat data pets...</p>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400 space-y-4 bg-white/40 rounded-3xl border border-dashed border-gray-300">
            <span className="text-6xl grayscale opacity-50">🔍</span>
            <p className="text-xl font-semibold text-slate-600">Tidak ada pet yang ditemukan.</p>
            <p className="text-sm">Coba sesuaikan pencarian atau filter kategori Anda.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {/* KRISIS Section */}
            {crisisPets.length > 0 && (
              <section className="relative">
                <div className="absolute -inset-x-4 -inset-y-4 bg-red-50/50 rounded-3xl -z-10"></div>
                <div className="flex items-center gap-3 mb-8 px-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 shadow-inner">
                    <span className="text-xl animate-pulse">🔴</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-red-600 tracking-tight">STOK KRISIS</h2>
                    <p className="text-sm text-red-500/80 font-medium">Membutuhkan restocking segera (≤ 3 unit)</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {crisisPets.map(pet => (
                    <PetCard 
                      key={pet.id} 
                      pet={pet} 
                      onEdit={(p) => { setEditingPet(p); setIsModalOpen(true); }}
                      onDelete={handleDeletePet}
                      onUpdateStock={handleUpdateStock}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* NORMAL Section */}
            {normalPets.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8 px-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shadow-inner">
                    <span className="text-xl">🐾</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">SEMUA PETS</h2>
                    <p className="text-sm text-slate-500 font-medium">Status stok dalam batas normal</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {normalPets.map(pet => (
                    <PetCard 
                      key={pet.id} 
                      pet={pet} 
                      onEdit={(p) => { setEditingPet(p); setIsModalOpen(true); }}
                      onDelete={handleDeletePet}
                      onUpdateStock={handleUpdateStock}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* BOROS Section */}
            {borosPets.length > 0 && (
              <section className="relative">
                <div className="absolute -inset-x-4 -inset-y-4 bg-blue-50/50 rounded-3xl -z-10"></div>
                <div className="flex items-center gap-3 mb-8 px-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shadow-inner">
                    <span className="text-xl">🔵</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-blue-600 tracking-tight">STOK BERLEBIH</h2>
                    <p className="text-sm text-blue-500/80 font-medium">Stok melimpah, tidak perlu restock (&gt; 6 unit)</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {borosPets.map(pet => (
                    <PetCard 
                      key={pet.id} 
                      pet={pet} 
                      onEdit={(p) => { setEditingPet(p); setIsModalOpen(true); }}
                      onDelete={handleDeletePet}
                      onUpdateStock={handleUpdateStock}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <PetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingPet}
        title={editingPet ? 'Edit Pet Info' : 'Tambah Pet Baru'}
        onSave={handleSavePet}
      />
    </div>
  )
}
