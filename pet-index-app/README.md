# Pet Index

Aplikasi manajemen stok pet dengan sistem biome dan deteksi krisis stok otomatis.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL)
- **Deploy**: Vercel

---

## Quick Start (Lokal)

### 1. Clone & Install

```bash
git clone <repo-url>
cd pet-index-app
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...
```

> Lihat `.env.example` sebagai referensi.

### 3. Setup Database Supabase

1. Buka [supabase.com](https://supabase.com) → buat project baru
2. Pergi ke **SQL Editor**
3. Jalankan seluruh isi file [`supabase.sql`](../supabase.sql) (di root workspace, bukan di dalam folder ini)
4. Pastikan Row Level Security (RLS) sudah aktif dan policy sudah dibuat

### 4. Jalankan Lokal

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Struktur Biome

| Level | Biome          | Emoji |
|-------|---------------|-------|
| 5     | Salju          | 🌨️   |
| 6     | Gunung Berapi  | 🌋   |
| 7     | Lautan Abyss   | 🌊   |
| 8     | Prasejarah     | 🦕   |
| 9     | Kosmik         | 🌌   |

Pet ditampilkan dari biome level terendah ke tertinggi (5 → 9).

---

## Sistem Stok

| Kondisi     | Kriteria  | Tampilan                     |
|-------------|-----------|------------------------------|
| KRISIS      | stock ≤ 3 | Border merah, badge 🔴 KRISIS |
| Normal      | stock 4–6 | Border abu-abu biasa          |
| BOROS STOK  | stock > 6 | Border biru, badge 🔵 BOROS   |

**Urutan tampilan:**
1. 🔴 PET STOK KRITIS (atas)
2. ALL PETS (tengah)
3. 🔵 PET BOROS STOK (bawah)

Di dalam setiap kelompok, diurutkan berdasarkan biome level (5→9), lalu alfabet.

---

## Fitur

- ✅ Lihat semua pet dalam card grid (1-4 kolom responsif)
- ✅ **Card Flip** — hover card untuk melihat info/deskripsi di balik kartu
- ✅ Search realtime berdasarkan nama
- ✅ Filter berdasarkan kategori (Cat, Dog, Bird, Fish, Other)
- ✅ Tambah pet (+ Add Pet)
- ✅ Edit pet
- ✅ Hapus pet dengan konfirmasi
- ✅ Kontrol stok: tombol + / − dan input langsung
- ✅ Deteksi KRISIS otomatis (stock ≤ 3)
- ✅ Deteksi BOROS otomatis (stock > 6)
- ✅ Toast notifikasi untuk semua aksi
- ✅ Loading, empty, dan error state

---

## Deploy ke Vercel

1. Push ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan environment variables di Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Vercel akan otomatis mendeteksi Next.js dan menggunakan konfigurasi yang tepat.
