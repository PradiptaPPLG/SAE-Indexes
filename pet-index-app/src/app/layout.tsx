import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Pet Index – Monitor Stok Pet Anda",
  description: "Kelola daftar pet dan stoknya dengan mudah. Pantau stok kritis dan kelola koleksi pet dari berbagai biome.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  )
}
