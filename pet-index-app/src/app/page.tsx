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
  const [isRiftMode, setIsRiftMode] = useState(false)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | undefined>(undefined)

  const [isSyncing, setIsSyncing] = useState(false)

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

  const handleSyncData = async () => {
    if (useMock) return
    setIsSyncing(true)
    try {
      let syncedCount = 0
      for (const mockPet of MOCK_PETS) {
        const exists = pets.find(p => p.image_url === mockPet.image_url || p.name === mockPet.name)
        if (!exists) {
          const { id, created_at, updated_at, ...petInsert } = mockPet
          await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            petInsert as Record<string, unknown>
          )
          syncedCount++
        }
      }
      if (syncedCount > 0) {
        toast.success(`Berhasil sinkronisasi ${syncedCount} pet baru ke database!`)
        await fetchPets()
      } else {
        toast.success('Semua pet sudah ada di database.')
      }
    } catch (err) {
      toast.error('Gagal sinkronisasi data: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsSyncing(false)
    }
  }

  // Filter and group pets
  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || pet.category === categoryFilter
      const matchesMode = isRiftMode ? pet.biome_level >= 8 : pet.biome_level < 8
      return matchesSearch && matchesCategory && matchesMode
    })
  }, [pets, searchQuery, categoryFilter, isRiftMode])

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
    <div className={`min-h-screen transition-colors duration-500 ${isRiftMode ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-indigo-50 selection:bg-purple-500/30' : 'bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 text-gray-900 selection:bg-blue-200'} pb-20 font-sans`}>
      <Toaster position="bottom-right" toastOptions={{ className: 'rounded-xl shadow-lg font-medium text-sm' }} />
      
      {/* Header & Controls */}
      <header className={`sticky top-0 z-30 transition-all duration-300 backdrop-blur-md shadow-sm border-b ${isRiftMode ? 'bg-indigo-950/70 border-purple-500/20' : 'bg-white/70 border-white/20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors duration-500 ${isRiftMode ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-purple-500/30' : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/30'}`}>
                <span className="text-xl font-black tracking-tighter">PI</span>
              </div>
              <h1 className={`text-2xl font-extrabold tracking-tight bg-clip-text text-transparent transition-colors duration-500 ${isRiftMode ? 'bg-gradient-to-r from-purple-200 to-fuchsia-300' : 'bg-gradient-to-r from-slate-800 to-slate-500'}`}>
                Pet Index
              </h1>
            </div>
            
            <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 max-w-md group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isRiftMode ? 'text-purple-300/60 group-focus-within:text-purple-300' : 'text-gray-400 group-focus-within:text-blue-500'}`} size={18} />
                <input
                  type="text"
                  placeholder="Search your pets..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 shadow-sm transition-all text-sm font-medium ${
                    isRiftMode 
                      ? 'bg-purple-900/40 border-purple-500/30 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-purple-900/60 text-purple-100 placeholder:text-purple-300/50' 
                      : 'bg-white/60 border-gray-200/80 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className={`py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 shadow-sm transition-all text-sm font-semibold cursor-pointer appearance-none min-w-[100px] ${
                  isRiftMode
                    ? 'bg-purple-900/40 border border-purple-500/30 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-purple-900/60 text-purple-100'
                    : 'bg-white/60 border border-gray-200/80 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white text-slate-700'
                }`}
              >
                {categories.map(c => <option key={c} value={c} className={isRiftMode ? 'bg-indigo-950' : 'bg-white'}>{c}</option>)}
              </select>

              <button
                onClick={() => setIsRiftMode(!isRiftMode)}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 ${
                  isRiftMode 
                    ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white shadow-purple-500/30 hover:shadow-purple-500/50' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white shadow-slate-900/20'
                }`}
                title="Toggle Rift Mode"
              >
                <span className="text-lg leading-none">{isRiftMode ? '🌌' : '🌍'}</span>
                <span className="hidden sm:inline tracking-wide">{isRiftMode ? 'Rift' : 'Normal'}</span>
              </button>

              <button
                onClick={() => { setEditingPet(undefined); setIsModalOpen(true); }}
                className={`flex items-center gap-2 py-2.5 px-4 sm:px-5 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 ${
                  isRiftMode
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30'
                }`}
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

      {/* Sync DB Banner */}
      {!useMock && pets.length > 0 && pets.length < MOCK_PETS.length && (
        <div className="bg-indigo-100/80 backdrop-blur-sm border-b border-indigo-200/50 text-indigo-900 text-xs sm:text-sm px-4 py-3 text-center font-medium shadow-inner flex items-center justify-center gap-4">
          <span>Terdapat data pet baru (Cherry Blossom & Titan Temple) yang belum ada di database Appwrite Anda.</span>
          <button 
            onClick={handleSyncData}
            disabled={isSyncing}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-3 py-1.5 rounded-lg font-bold shadow transition-colors"
          >
            {isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Data Sekarang'}
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-70">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isRiftMode ? 'border-purple-900/50 border-t-purple-400' : 'border-gray-200 border-t-blue-500'}`}></div>
            <p className="font-medium tracking-wide">Memuat data pets...</p>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-32 space-y-4 rounded-3xl border border-dashed backdrop-blur-sm ${
            isRiftMode ? 'bg-indigo-900/30 border-purple-500/30 text-purple-200' : 'bg-white/40 border-gray-300 text-gray-500'
          }`}>
            <span className="text-6xl grayscale opacity-50">🔍</span>
            <p className={`text-xl font-semibold ${isRiftMode ? 'text-purple-100' : 'text-slate-600'}`}>Tidak ada pet yang ditemukan.</p>
            <p className="text-sm opacity-80">Coba sesuaikan pencarian atau filter kategori Anda.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {/* KRISIS Section */}
            {crisisPets.length > 0 && (
              <section className="relative">
                <div className={`absolute -inset-x-4 -inset-y-4 rounded-3xl -z-10 transition-colors ${isRiftMode ? 'bg-red-900/20' : 'bg-red-50/50'}`}></div>
                <div className="flex items-center gap-3 mb-8 px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${isRiftMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-500'}`}>
                    <span className="text-xl animate-pulse">🔴</span>
                  </div>
                  <div>
                    <h2 className={`text-2xl font-extrabold tracking-tight ${isRiftMode ? 'text-red-400' : 'text-red-600'}`}>STOK KRISIS</h2>
                    <p className={`text-sm font-medium ${isRiftMode ? 'text-red-400/80' : 'text-red-500/80'}`}>Membutuhkan restocking segera (≤ 3 unit)</p>
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
                      isRiftMode={isRiftMode}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* NORMAL Section */}
            {normalPets.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8 px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${isRiftMode ? 'bg-purple-900/50' : 'bg-slate-200'}`}>
                    <span className="text-xl">🐾</span>
                  </div>
                  <div>
                    <h2 className={`text-2xl font-extrabold tracking-tight ${isRiftMode ? 'text-purple-200' : 'text-slate-800'}`}>SEMUA PETS</h2>
                    <p className={`text-sm font-medium ${isRiftMode ? 'text-purple-300/70' : 'text-slate-500'}`}>Status stok dalam batas normal</p>
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
                      isRiftMode={isRiftMode}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* BOROS Section */}
            {borosPets.length > 0 && (
              <section className="relative">
                <div className={`absolute -inset-x-4 -inset-y-4 rounded-3xl -z-10 transition-colors ${isRiftMode ? 'bg-cyan-900/20' : 'bg-blue-50/50'}`}></div>
                <div className="flex items-center gap-3 mb-8 px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${isRiftMode ? 'bg-cyan-900/50 text-cyan-300' : 'bg-blue-100 text-blue-500'}`}>
                    <span className="text-xl">🔵</span>
                  </div>
                  <div>
                    <h2 className={`text-2xl font-extrabold tracking-tight ${isRiftMode ? 'text-cyan-300' : 'text-blue-600'}`}>STOK BERLEBIH</h2>
                    <p className={`text-sm font-medium ${isRiftMode ? 'text-cyan-400/80' : 'text-blue-500/80'}`}>Stok melimpah, tidak perlu restock (&gt; 6 unit)</p>
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
                      isRiftMode={isRiftMode}
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
