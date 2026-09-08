export interface Pet {
  id: string
  name: string
  category: string
  stock: number
  image_url: string | null
  description: string | null
  biome_level: number
  created_at: string
  updated_at: string
}

export type PetInsert = Omit<Pet, 'id' | 'created_at' | 'updated_at'>
export type PetUpdate = Partial<PetInsert>
