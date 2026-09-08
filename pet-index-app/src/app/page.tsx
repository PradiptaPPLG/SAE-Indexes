'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Pet, PetInsert, PetUpdate } from '@/types/pet'
import PetCard from '@/components/PetCard'
import PetModal from '@/components/PetModal'
import { Plus, Search } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | undefined>(undefined)

  // Fetch pets initially and set up real-time (optional, here we just fetch)
  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('biome_level', { ascending: true })
      .order('name', { ascending: true })
    
    if (error) {
      toast.error('Failed to fetch pets: ' + error.message)
    } else {
      setPets(data || [])
    }
    setLoading(false)
  }

  const handleSavePet = async (petData: PetInsert | PetUpdate) => {
    if (editingPet) {
      // Update
      const { error } = await supabase
        .from('pets')
        .update(petData)
        .eq('id', editingPet.id)
      
      if (error) throw error
      toast.success('Pet updated!')
    } else {
      // Insert
      const { error } = await supabase
        .from('pets')
        .insert([petData as PetInsert])
      
      if (error) throw error
      toast.success('Pet added!')
    }
    await fetchPets()
  }

  const handleDeletePet = async (pet: Pet) => {
    if (confirm(`Delete ${pet.name}? This action cannot be undone.`)) {
      const { error } = await supabase.from('pets').delete().eq('id', pet.id)
      if (error) {
        toast.error('Failed to delete pet: ' + error.message)
      } else {
        toast.success('Pet deleted')
        await fetchPets()
      }
    }
  }

  const handleUpdateStock = async (pet: Pet, newStock: number) => {
    // Optimistic UI update
    setPets(prev => prev.map(p => p.id === pet.id ? { ...p, stock: newStock } : p))
    
    const { error } = await supabase
      .from('pets')
      .update({ stock: newStock })
      .eq('id', pet.id)
      
    if (error) {
      toast.error('Failed to update stock: ' + error.message)
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
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <Toaster position="bottom-right" />
      
      {/* Header & Controls */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Pet Index</h1>
            
            <div className="flex flex-1 items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search pet..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <button
                onClick={() => { setEditingPet(undefined); setIsModalOpen(true); }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} /> <span className="hidden sm:inline">Add Pet</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {loading ? (
          <div className="flex justify-center py-20 text-gray-500">Loading pets...</div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No pets found.</p>
          </div>
        ) : (
          <>
            {/* KRISIS Section */}
            {crisisPets.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-red-600 mb-6 border-b-2 border-red-200 pb-2 flex items-center gap-2">
                  <span>🔴</span> PET STOK KRITIS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
                  ALL PETS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <section>
                <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2 flex items-center gap-2">
                  <span>🔵</span> PET BOROS STOK
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </>
        )}
      </main>

      <PetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingPet}
        title={editingPet ? 'Edit Pet' : 'Add New Pet'}
        onSave={handleSavePet}
      />
    </div>
  )
}
